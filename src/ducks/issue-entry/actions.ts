import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CLIssueDetail, CLIssueEntry, CLIssueResponse} from "../../types";
import {RootState} from "@/app/configureStore";
import {selectCurrentIssueDetail, selectCurrentIssueHeader, selectCurrentIssueStatus} from "./issueEntrySlice";
import {deleteCLIssue, deleteCLReceipt, fetchCLIssue, postCLIssue, postReceiveCLIssue} from "./api";
import dayjs from "dayjs";
import {CLIssue} from "chums-types";
import {isCLIssue} from "@/utils/issue";
import Decimal from "decimal.js";
import {calcCostReceived} from "@/ducks/issue-entry/utils";

export const setIssueDate = createAction('issueEntry/setIssueDate', (date: Date | string | undefined) => {
    const issueDate = date && dayjs(date).isValid()
        ? dayjs(date).add(new Date().getTimezoneOffset(), "minutes").format('YYYY-MM-DD')
        : dayjs(new Date()).add(new Date().getTimezoneOffset(), "minutes").format('YYYY-MM-DD')
    return {
        payload: issueDate,
    }
});

export const loadCLIssueEntry = createAsyncThunk<CLIssueResponse | null, CLIssueEntry>(
    'issueEntry/load',
    async (arg) => {
        return await fetchCLIssue(arg.id!)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && selectCurrentIssueStatus(state) === 'idle';
        }
    }
)

export const saveCLIssueEntry = createAsyncThunk<CLIssueResponse | null, CLIssueEntry, { state: RootState }>(
    'issueEntry/save',
    async (arg) => {
        return await postCLIssue(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.detail?.length && selectCurrentIssueStatus(state) === 'idle';
        }
    }
)


export const removeCLIssueEntry = createAsyncThunk<void, CLIssueEntry, { state: RootState }>(
    'issueEntry/remove',
    async (arg) => {
        return await deleteCLIssue(arg.id!);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.id && selectCurrentIssueStatus(state) === 'idle';
        }
    }
)

export interface ReceiveCLIssueProps extends Pick<CLIssue, 'id' | 'DateReceived'
    | 'QuantityReceived' | 'QuantityRepaired' | 'CostReceived'> {
    detail: Pick<CLIssueDetail, 'id' | 'QuantityReceived'>[]
}


export const receiveCLIssue = createAsyncThunk<CLIssueResponse, string, { state: RootState }>(
    'issueEntry/receive',
    async (arg, {getState}) => {
        const state = getState()
        const header = selectCurrentIssueHeader(state) as CLIssue;
        const detail = selectCurrentIssueDetail(state) as CLIssueDetail[];
        const costReceived = calcCostReceived(detail, header.QuantityRepaired)
        const props: ReceiveCLIssueProps = {
            id: header.id!,
            DateReceived: arg,
            QuantityReceived: header.QuantityReceived,
            QuantityRepaired: header.QuantityRepaired,
            CostReceived: costReceived,
            detail: detail.map(item => ({id: item.id, QuantityReceived: item.QuantityReceived}))
        }
        return await postReceiveCLIssue(props);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const issue = selectCurrentIssueHeader(state);
            if (!isCLIssue(issue)) {
                return false;
            }

            return !!arg && selectCurrentIssueStatus(state) === 'idle'
                && new Decimal(issue.QuantityReceived).gt(0);
        }
    }
)

export const removeCLReceipt = createAsyncThunk<CLIssueResponse, number|string, {state:RootState}>(
    'issueEntry/removeReceipt',
    async (arg) => {
        return await deleteCLReceipt(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentIssueStatus(state) === 'idle';
        }
    }
)
