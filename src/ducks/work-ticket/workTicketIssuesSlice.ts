import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import {selectCurrentIssueId} from "@/ducks/issue-entry/issueEntrySlice";
import {CLIssue} from "chums-types";

const issuesAdapter = createEntityAdapter<CLIssue, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const issuesSelectors = issuesAdapter.getSelectors();

export interface WorkTicketIssuesExtraState {
    workTicketNo: string;
}

const extraState: WorkTicketIssuesExtraState = {
    workTicketNo: "",
}
const workTicketIssuesSlice = createSlice({
    name: "workTicketIssues",
    initialState: issuesAdapter.getInitialState(extraState),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setCurrentWorkTicket.pending, (state, action) => {
                if (state.workTicketNo !== action.meta.arg) {
                    issuesAdapter.removeAll(state);
                }
            })
            .addCase(setCurrentWorkTicket.fulfilled, (state, action) => {
                issuesAdapter.setAll(state, action.payload?.issues ?? []);
            })
    },
    selectors: {
        selectWorkTicketIssues: (state) => issuesSelectors.selectAll(state),
    }
});
export const {selectWorkTicketIssues} = workTicketIssuesSlice.selectors;
export const selectOtherIssues = createSelector(
    [selectWorkTicketIssues, selectCurrentIssueId],
    (list, id) => {
        return list.filter(issue => issue.id !== id);
    }
)

export default workTicketIssuesSlice;
