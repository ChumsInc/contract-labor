import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {sortVendorTotals} from "./utils";

export const selectVendorTotals = (state:RootState) => state.vendorTotals.list;
export const selectVendorTotalsLoading = (state:RootState) => state.vendorTotals.loading;
export const selectVendorTotalsSort = (state:RootState) => state.vendorTotals.sort;



export const selectSortedVendorTotals = createSelector(
    [selectVendorTotals, selectVendorTotalsSort],
    (list, sort) => {
        return [...list]
            .sort(sortVendorTotals(sort));
    }
)
