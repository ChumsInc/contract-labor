import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchCLSteps} from "@/ducks/dl-steps/api";
import {DLStep} from "chums-types";
import {RootState} from "@/app/configureStore";
import {selectStepsStatus} from "@/ducks/dl-steps/stepsSlice";

export const loadCLSteps  = createAsyncThunk<DLStep[], void, {state:RootState}>(
    'dl-steps/load',
    async () => {
        return await fetchCLSteps();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return selectStepsStatus(state) === 'idle';
        }
    }
)
