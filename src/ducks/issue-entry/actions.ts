import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CLIssueEntry, CLIssueResponse} from "../../types";
import {RootState} from "../../app/configureStore";
import {selectCurrentIssueStatus} from "./issueEntrySlice";
import {deleteCLIssue, fetchCLIssue, postCLIssue} from "./api";
import dayjs from "dayjs";

export const setIssueDate = createAction('issue-entry/setIssueDate', (date: Date | string | undefined) => {
    const issueDate = date && dayjs(date).isValid()
        ? dayjs(date).add(new Date().getTimezoneOffset(), "minutes").format('YYYY-MM-DD')
        : dayjs(new Date()).add(new Date().getTimezoneOffset(), "minutes").format('YYYY-MM-DD')
    return {
        payload: issueDate,
    }
});

export const loadCLIssueEntry = createAsyncThunk<CLIssueResponse | null, CLIssueEntry>(
    'issue-entry/load',
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

export const saveCLIssueEntry = createAsyncThunk<CLIssueResponse|null, CLIssueEntry, {state:RootState}>(
    'issue-entry/save',
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


export const removeCLIssueEntry = createAsyncThunk<void, CLIssueEntry, {state:RootState}>(
    'issue-entry/remove',
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
