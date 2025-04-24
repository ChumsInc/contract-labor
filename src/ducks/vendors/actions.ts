import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CLVendor} from "chums-types";
import {fetchVendors, postVendor} from "./api";
import {RootState} from "@/app/configureStore";
import {selectVendorsLoading, selectVendorsSaving} from "./selectors";
import {SortProps} from "@chumsinc/sortable-tables";

export const toggleShowInactive = createAction<boolean | undefined>('vendors/toggleShowInactive');
export const setVendorsSort = createAction<SortProps<CLVendor>>('vendors/setSort');
export const setCurrentVendor = createAction<CLVendor|undefined>('vendors/setCurrent');
export const updateVendor = createAction<Partial<CLVendor>>('vendors/updateCurrent');
export const createNewVendor = createAction('vendors/new');

export const loadVendors = createAsyncThunk<CLVendor[]>(
    'vendors/list/load',
    async () => {
        return fetchVendors();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectVendorsSaving(state) && !selectVendorsLoading(state);
        }
    }
)


export const saveVendor = createAsyncThunk<CLVendor[], CLVendor>(
    'vendors/save',
    async (arg) => {
        return await postVendor(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.VendorNo && !!arg.VendorName && !selectVendorsSaving(state) && !selectVendorsLoading(state);
        }
    }
)
