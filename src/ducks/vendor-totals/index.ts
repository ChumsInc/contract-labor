import {VendorWeekTotal} from "../../types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {loadVendorTotals, setVendorTotalsSort, toggleShowInactive} from "./actions";
import {defaultVendorSort, sortVendorTotals} from "./utils";

export interface VendorTotalsState {
    list: VendorWeekTotal[];
    loading: boolean;
    showInactive: boolean;
    sort: SortProps<VendorWeekTotal>
}

const initialState: VendorTotalsState = {
    list: [],
    loading: false,
    showInactive: true,
    sort: {field: 'QuantityIssuedWeek', ascending: false}
}


const vendorsTotalsReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadVendorTotals.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadVendorTotals.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(sortVendorTotals(defaultVendorSort));
        })
        .addCase(loadVendorTotals.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setVendorTotalsSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
        })

});

export default vendorsTotalsReducer;


