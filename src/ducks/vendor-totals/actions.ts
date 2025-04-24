import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchVendorTotals} from "./api";
import {RootState} from "@/app/configureStore";
import {selectVendorsSaving} from "../vendors/selectors";
import {selectVendorTotalsStatus} from "./vendorTotalsSlice";
import dayjs from "dayjs";
import {CLVendorWeekTotal} from "chums-types";

export const loadVendorTotals = createAsyncThunk<CLVendorWeekTotal[], void, {state:RootState}>(
    'vendor-totals/load',
    async () => {
        return await fetchVendorTotals();
    }, {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectVendorsSaving(state) && selectVendorTotalsStatus(state) === 'idle';
        }
    }
)
