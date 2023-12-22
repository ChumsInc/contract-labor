import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {VendorWeekTotal} from "../../types";
import {fetchVendorTotals} from "./api";
import {RootState} from "../../app/configureStore";
import {selectVendorsSaving} from "../vendors/selectors";
import {SortProps} from "chums-components";
import {selectVendorTotalsLoading} from "./selectors";
import dayjs from "dayjs";

export const toggleShowInactive = createAction<boolean|undefined>('vendor-totals/toggleShowInactive');
export const setVendorTotalsSort = createAction<SortProps<VendorWeekTotal>>('vendor-totals/setSort');

export const loadVendorTotals = createAsyncThunk<VendorWeekTotal[], string>(
    'vendor-totals/load',
    async (arg) => {
        return await fetchVendorTotals(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return dayjs(arg).isValid() && !selectVendorsSaving(state) && !selectVendorTotalsLoading(state);
        }
    }
)
