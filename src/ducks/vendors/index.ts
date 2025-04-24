import {CLVendor, Editable, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadVendors, saveVendor} from "./actions";
import {emptyVendor, sortVendors} from "./utils";
import {dismissAlert} from "@chumsinc/alert-list";

const adapter = createEntityAdapter<CLVendor, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
});

const selectors = adapter.getSelectors();

export interface VendorsState {
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    showInactive: boolean;
    sort: SortProps<CLVendor>
    current: (CLVendor & Editable) | null;
}

const initialState: VendorsState = {
    status: 'idle',
    showInactive: false,
    sort: {field: 'VendorNo', ascending: true},
    current: null,
}

const vendorsSlice = createSlice({
    name: 'vendors',
    initialState: adapter.getInitialState(initialState),
    reducers: {
        createNewVendor: (state) => {
            state.current = {...emptyVendor};
        },
        setCurrentVendor: (state, action: PayloadAction<CLVendor | null>) => {
            state.current = action.payload ?? null;
        },
        setVendorsSort: (state, action: PayloadAction<SortProps<CLVendor>>) => {
            state.sort = action.payload;
        },
        toggleShowInactive: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        },
        updateVendor: (state, action: PayloadAction<Partial<CLVendor>>) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadVendors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadVendors.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                if (state.current) {
                    const [current] = action.payload.filter(v => v.id === state.current?.id);
                    state.current = current ?? null;
                }
            })
            .addCase(loadVendors.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(saveVendor.pending, (state) => {
                state.status = 'saving'
            })
            .addCase(saveVendor.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload) {
                    adapter.upsertOne(state, action.payload);
                }
                state.current = action.payload;
            })
            .addCase(saveVendor.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload?.context?.startsWith('vendor')) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectVendors: (state) => selectors.selectAll(state),
        selectVendorsStatus: (state) => state.status,
        selectVendorSort: (state) => state.sort,
        selectCurrentVendor: (state) => state.current,
        selectShowInactive: (state) => state.showInactive,
        selectVendorList: (state) => selectors.selectAll(state),
    }
})

export const {
    createNewVendor,
    setCurrentVendor,
    setVendorsSort,
    toggleShowInactive,
    updateVendor
} = vendorsSlice.actions;
export const {
    selectVendors,
    selectVendorsStatus,
    selectVendorSort,
    selectCurrentVendor,
    selectShowInactive,
    selectVendorList
} = vendorsSlice.selectors;

export const selectSortedVendorList = createSelector(
    [selectVendorList, selectShowInactive, selectVendorSort],
    (list, show, sort) => {
        return list
            .filter(v => show || v.active)
            .sort(sortVendors(sort));
    }
)

export default vendorsSlice;
