import {RootState} from "@/app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {sortVendors} from "./utils";

export const selectVendorList = (state: RootState) => state.vendors.list;
export const selectVendorsLoading = (state: RootState) => state.vendors.loading;
export const selectVendorsSaving = (state: RootState) => state.vendors.saving;
export const selectVendorSort = (state: RootState) => state.vendors.sort;
export const selectShowInactive = (state: RootState) => state.vendors.showInactive;
export const selectCurrentVendor = (state: RootState) => state.vendors.current ?? null;

export const selectSortedVendorList = createSelector(
    [selectVendorList, selectShowInactive, selectVendorSort],
    (list, show, sort) => {
        return list
            .filter(v => show || v.active)
            .sort(sortVendors(sort));
    }
)
