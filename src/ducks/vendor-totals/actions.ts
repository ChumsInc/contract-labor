import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchVendorTotals} from "./api";
import {RootState} from "@/app/configureStore";
import {selectVendorTotalsStatus} from "./vendorTotalsSlice";
import {CLVendorWeekTotal} from "chums-types";
import {selectVendorsStatus} from "@/ducks/vendors";

export const loadVendorTotals = createAsyncThunk<CLVendorWeekTotal[], void, { state: RootState }>(
    'vendor-totals/load',
    async () => {
        return await fetchVendorTotals();
    }, {
        condition: (arg, {getState}) => {
            const state = getState();
            return selectVendorsStatus(state) === 'idle' && selectVendorTotalsStatus(state) === 'idle';
        }
    }
)
