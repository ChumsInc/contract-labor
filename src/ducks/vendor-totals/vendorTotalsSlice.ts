import {SortProps} from "@chumsinc/sortable-tables";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadVendorTotals} from "./actions";
import {sortVendorTotals} from "./utils";
import {CLVendorWeekTotal} from "chums-types";


export interface VendorTotalsExtraState {
    status: 'idle' | 'loading';
    showInactive: boolean;
    sort: SortProps<CLVendorWeekTotal>
}

const extraState: VendorTotalsExtraState = {
    status: 'idle',
    showInactive: true,
    sort: {field: 'VendorNo', ascending: true}
}

const vendorAdapter = createEntityAdapter<CLVendorWeekTotal, string>({
    selectId: (arg) => arg.VendorNo,
    sortComparer: (a, b) => a.VendorNo.localeCompare(b.VendorNo),
});

const vendorSelectors = vendorAdapter.getSelectors();

const vendorTotalsSlice = createSlice({
    name: 'vendorTotals',
    initialState: vendorAdapter.getInitialState(extraState),
    reducers: {
        setVendorTotalsSort: (state, action: PayloadAction<SortProps<CLVendorWeekTotal>>) => {
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

