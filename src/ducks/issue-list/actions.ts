import {createAsyncThunk} from "@reduxjs/toolkit";
import {CLIssue} from "chums-types";
import {fetchCurrentIssueList} from "./api";
import {RootState} from "@/app/configureStore";
import {selectStatus} from "@/ducks/issue-list/issueListSlice";

export const loadCurrentIssueList = createAsyncThunk<CLIssue[], void>(
    'issueList/load',
    async () => {
        return await fetchCurrentIssueList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectStatus(state) === 'idle';
        }
    }
)

