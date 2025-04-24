import {createAsyncThunk} from "@reduxjs/toolkit";
import {CLIssue} from "chums-types";
import {IssueSearchParams} from "@/src/types";
import {RootState} from "@/app/configureStore";
import {fetchIssueSearch} from "@/ducks/issue-history/api";
import {selectHistoryLoading} from "@/ducks/issue-history/index";

export const loadHistory = createAsyncThunk<CLIssue[], IssueSearchParams, {state:RootState}>(
    'issueHistory/load',
    async (arg) => {
        return await fetchIssueSearch(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectHistoryLoading(state);
        }
    }
)
