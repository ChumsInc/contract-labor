import {createAsyncThunk} from "@reduxjs/toolkit";
import {CLVendor} from "chums-types";
import {fetchVendors, postVendor} from "./api";
import {RootState} from "@/app/configureStore";
import {selectVendorsStatus} from "@/ducks/vendors/index";

export const loadVendors = createAsyncThunk<CLVendor[]>(
    'vendors/list/load',
    async () => {
        return fetchVendors();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectVendorsStatus(state) === 'idle';
        }
    }
)


export const saveVendor = createAsyncThunk<CLVendor | null, CLVendor>(
    'vendors/save',
    async (arg) => {
        return await postVendor(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.VendorNo && !!arg.VendorName && selectVendorsStatus(state) === 'idle';
        }
    }
)
