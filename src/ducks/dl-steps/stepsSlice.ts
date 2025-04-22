import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {DLStep} from "chums-types";
import {loadCLSteps} from "@/ducks/dl-steps/actions";

const stepsAdapter = createEntityAdapter<DLStep, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
});

const selectors = stepsAdapter.getSelectors();

export interface StepsExtraState {
    status: 'idle' | 'loading';
}
const extraState: StepsExtraState = {
    status: 'idle',
}

const stepsSlice = createSlice({
    name: 'dl-steps',
    initialState: stepsAdapter.getInitialState(extraState),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadCLSteps.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadCLSteps.fulfilled, (state, action) => {
                state.status = 'idle';
                stepsAdapter.setAll(state, action.payload);
            })
            .addCase(loadCLSteps.rejected, (state) => {
                state.status = 'idle';
            })
    },
    selectors: {
        selectSteps: (state) => selectors.selectAll(state),
        selectStepsStatus: (state) => state.status,
    }
});

export const {selectSteps, selectStepsStatus} = stepsSlice.selectors;

export default stepsSlice;
