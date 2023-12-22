import {Vendor} from "../../types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {
    createNewVendor,
    loadVendors,
    saveVendor,
    setCurrentVendor,
    setVendorsSort,
    toggleShowInactive,
    updateVendor
} from "./actions";
import {defaultVendorSort, emptyVendor, sortVendors} from "./utils";
import {Editable} from "chums-types/src/generics";

export interface VendorsState {
    list: Vendor[];
    loading: boolean;
    saving: boolean;
    showInactive: boolean;
    sort: SortProps<Vendor>
    current: (Vendor & Editable)|null;
}

const initialState: VendorsState = {
    list: [],
    loading: false,
    saving: false,
    showInactive: false,
    sort: {field: 'VendorNo', ascending: true},
    current: null,
}


const vendorsReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadVendors.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadVendors.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(sortVendors(defaultVendorSort));
            if (state.current) {
                const [current] = action.payload.filter(v => v.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(loadVendors.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveVendor.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveVendor.fulfilled, (state, action) => {
            state.saving = false;
            state.list = action.payload.sort(sortVendors(defaultVendorSort));
            if (state.current) {
                const [current] = action.payload.filter(v => v.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(saveVendor.rejected, (state) => {
            state.saving = false;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
        })
        .addCase(setVendorsSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(setCurrentVendor, (state, action) => {
            state.current = action.payload ?? null;
        })
        .addCase(updateVendor, (state, action)=> {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
        .addCase(createNewVendor, (state) => {
            state.current = {...emptyVendor};
        })
});

export default vendorsReducer;


