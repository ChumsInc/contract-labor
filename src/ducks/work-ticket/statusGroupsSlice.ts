import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {loadWorkTicketStatusGroups} from "@/ducks/work-ticket/actions";
import {WorkTicketStatusSet} from "chums-types";
import {WorkTicketGroup} from "chums-types/src/production/work-ticket-status";

const adapter = createEntityAdapter<WorkTicketGroup, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
});
const adapterSelectors = adapter.getSelectors();

export interface WorkTicketStatusGroupExtraState {
    status: 'idle' | 'loading';
}

const extraState: WorkTicketStatusGroupExtraState = {
    status: 'idle'
}

const workStatusGroupSlice = createSlice({
    name: 'workStatusGroup',
    initialState: adapter.getInitialState(extraState),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadWorkTicketStatusGroups.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadWorkTicketStatusGroups.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
            })
            .addCase(loadWorkTicketStatusGroups.rejected, (state) => {
                state.status = 'idle'
            })
    },
    selectors: {
        selectStatusGroups: (state) => adapterSelectors.selectAll(state),
        selectStatusGroupsLoading: (state) => state.status,
    }
});

export const {selectStatusGroups, selectStatusGroupsLoading} = workStatusGroupSlice.selectors;
export default workStatusGroupSlice;
