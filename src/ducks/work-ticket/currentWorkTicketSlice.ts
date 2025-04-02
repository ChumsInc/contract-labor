import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {WorkTicketStep} from "chums-types";
import {WorkTicketHeader} from "@/src/types";
import {loadCLIssueEntry} from "@/ducks/issue-entry/actions";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";

const stepsAdapter = createEntityAdapter<WorkTicketStep, string>({
    selectId: (arg) => arg.LineKey,
    sortComparer: (a, b) => a.LineKey.localeCompare(b.LineKey),
});

const adapterSelectors = stepsAdapter.getSelectors();

export interface CurrentWorkTicketExtraState {
    vendorNo: string;
    workTicketNo: string;
    header: WorkTicketHeader | null;
    status: 'loading' | 'idle';
}

const extraState: CurrentWorkTicketExtraState = {
    vendorNo: '',
    workTicketNo: '',
    header: null,
    status: 'idle',
}

const currentWorkTicketSlice = createSlice({
    name: 'currentWorkTicket',
    initialState: stepsAdapter.getInitialState(extraState),
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadCLIssueEntry.fulfilled, (state, action) => {
                if (action.payload?.issue?.WorkTicketNo?.toUpperCase() === 'N/A') {
                    state.header = null;
                    stepsAdapter.removeAll(state);
                }
            })
            .addCase(setCurrentWorkTicket.pending, (state, action) => {
                if (state.workTicketNo !== action.meta.arg) {
                    state.workTicketNo = action.meta.arg;
                    state.status = 'loading';
                }
                if (state.header?.WorkTicketNo !== action.meta.arg) {
                    state.header = null;
                    stepsAdapter.removeAll(state);
                }
            })
            .addCase(setCurrentWorkTicket.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload) {
                    state.workTicketNo = action.payload.header?.WorkTicketNo ?? '';
                    state.header = action.payload.header ?? null;
                    stepsAdapter.setAll(state, action.payload.steps);
                }
            })
            .addCase(setCurrentWorkTicket.rejected, (state) => {
                state.status = 'idle';
            })
    },
    selectors: {
        selectWorkTicketNo: (state) => state.workTicketNo,
        selectWorkTicketHeader: (state) => state.header,
        selectWorkTicketSteps: (state) => adapterSelectors.selectAll(state),
        selectWorkTicketStatus: (state) => state.status,

    }
});

export const {
    selectWorkTicketStatus,
    selectWorkTicketSteps,
    selectWorkTicketHeader,
    selectWorkTicketNo
} = currentWorkTicketSlice.selectors;

export default currentWorkTicketSlice
