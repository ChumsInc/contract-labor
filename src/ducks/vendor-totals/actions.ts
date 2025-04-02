import {createAsyncThunk} from "@reduxjs/toolkit";
import {VendorWeekTotal} from "../../types";
import {fetchVendorTotals} from "./api";
import {RootState} from "@/app/configureStore";
import {selectVendorsSaving} from "../vendors/selectors";
import {selectVendorTotalsStatus} from "./vendorTotalsSlice";
import dayjs from "dayjs";

export const loadVendorTotals = createAsyncThunk<VendorWeekTotal[], string>(
    'vendor-totals/load',
    async (arg) => {
        return await fetchVendorTotals(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return dayjs(arg).isValid() && !selectVendorsSaving(state) && selectVendorTotalsStatus(state) === 'idle';
        }
    }
)
