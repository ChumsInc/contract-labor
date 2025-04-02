import {VendorWeekTotal} from "../../types";
import {SortProps} from "@chumsinc/sortable-tables";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadVendorTotals} from "./actions";
import {sortVendorTotals} from "./utils";


export interface VendorTotalsExtraState {
    status: 'idle' | 'loading';
    showInactive: boolean;
    sort: SortProps<VendorWeekTotal>
}

const extraState: VendorTotalsExtraState = {
    status: 'idle',
    showInactive: true,
    sort: {field: 'VendorNo', ascending: true}
}

const vendorAdapter = createEntityAdapter<VendorWeekTotal, string>({
    selectId: (arg) => arg.VendorNo,
    sortComparer: (a, b) => a.VendorNo.localeCompare(b.VendorNo),
});

const vendorSelectors = vendorAdapter.getSelectors();

const vendorTotalsSlice = createSlice({
    name: 'vendorTotals',
    initialState: vendorAdapter.getInitialState(extraState),
    reducers: {
        setVendorTotalsSort: (state, action: PayloadAction<SortProps<VendorWeekTotal>>) => {
            state.sort = action.payload;
        },
        toggleShowInactive: (state, action: PayloadAction<boolean | undefined>) => {
            state.showInactive = action.payload ?? !state.showInactive;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadVendorTotals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadVendorTotals.fulfilled, (state, action) => {
                state.status = 'idle';
                vendorAdapter.setAll(state, action.payload);
            })
            .addCase(loadVendorTotals.rejected, (state) => {
                state.status = 'idle';
            })

    },
    selectors: {
        selectVendorTotals: (state) => vendorSelectors.selectAll(state),
        selectVendorTotalsStatus: (state) => state.status,
        selectVendorTotalsSort: (state) => state.sort,
    }
})

export const {setVendorTotalsSort, toggleShowInactive} = vendorTotalsSlice.actions;
export const {selectVendorTotalsStatus, selectVendorTotalsSort, selectVendorTotals} = vendorTotalsSlice.selectors;

export const selectSortedVendorTotals = createSelector(
    [selectVendorTotals, selectVendorTotalsSort],
    (list, sort) => {
        return [...list]
            .sort(sortVendorTotals(sort));
    }
)

export default vendorTotalsSlice;

