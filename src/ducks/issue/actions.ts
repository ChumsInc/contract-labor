import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CLIssue} from "../../types";
import {fetchCurrentIssueList} from "./api";
import {RootState} from "../../app/configureStore";
import {selectIssueListLoading} from "./selectors";
import {SortProps} from "chums-components";

export const setCurrentIssueVendorNo = createAction<string|null>('issue/current/vendorNo');
export const setCurrentIssueSort = createAction<SortProps<CLIssue>>('issue/list/sort');

export const loadCurrentIssueList = createAsyncThunk<CLIssue[]>(
    'issue/list/load',
    async () => {
        return await fetchCurrentIssueList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectIssueListLoading(state);
        }
    }
)
