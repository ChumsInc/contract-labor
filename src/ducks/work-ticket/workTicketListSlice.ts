import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WorkTicketWorkStatusItem} from "chums-types";
import {WorkTicketSortProps, WorkTicketTableRow} from "@/ducks/work-ticket/types";
import {wtStatusSorter} from "@/ducks/work-ticket/utils";
import {loadWorkTicketStatusList, setWorkTicketStatus} from "@/ducks/work-ticket/actions";
import {dismissAlert} from "@chumsinc/alert-list";

const listAdapter = createEntityAdapter<WorkTicketWorkStatusItem, string>({
    selectId: (arg) => arg.WorkTicketKey,
    sortComparer: (a, b) => a.WorkTicketKey.localeCompare(b.WorkTicketKey),
})

const adapterSelectors = listAdapter.getSelectors();

export interface WorkTicketsExtraState {
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    search: string;
    sort: WorkTicketSortProps;
}

const extraState: WorkTicketsExtraState = {
    status: 'idle',
    search: '',
    sort: {field: 'WorkTicketNo', ascending: true},
}

const workTicketsListSlice = createSlice({
    name: 'workTicketsList',
    initialState: listAdapter.getInitialState(extraState),
    reducers: {
        setWTListSort: (state, action: PayloadAction<WorkTicketSortProps>) => {
            state.sort = action.payload;
        },
        setWTListSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadWorkTicketStatusList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadWorkTicketStatusList.fulfilled, (state, action) => {
                listAdapter.setAll(state, action.payload);
                state.status = 'idle';
            })
            .addCase(loadWorkTicketStatusList.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(setWorkTicketStatus.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(setWorkTicketStatus.fulfilled, (state, action) => {
                state.status = 'idle';
                if (action.payload) {
                    listAdapter.setOne(state, action.payload);
                }
            })
            .addCase(setWorkTicketStatus.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if ([
                    loadWorkTicketStatusList.typePrefix,
                    setWorkTicketStatus.typePrefix
                ].includes(action.payload.context ?? '')) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectWTListAll: (state) => adapterSelectors.selectAll(state),
        selectWTListStatus: (state) => state.status,
        selectWTListSearch: (state) => state.search,
        selectWTListSort: (state) => state.sort,
    }
});

export const {setWTListSort, setWTListSearch} = workTicketsListSlice.actions;
export const {
    selectWTListAll,
    selectWTListStatus,
    selectWTListSort,
    selectWTListSearch
} = workTicketsListSlice.selectors;

export const selectSortedWTList = createSelector(
    [selectWTListAll, selectWTListSearch, selectWTListSort],
    (list, _search, sort): WorkTicketTableRow[] => {
        const search = _search.toUpperCase();
        return (list as WorkTicketTableRow[])
            .filter(wt => {
                return !search.trim()
                    || wt.WorkTicketNo.includes(_search)
                    || wt.MakeForWorkTicketNo?.includes(_search)
                    || wt.MakeForSalesOrderNo?.includes(_search)
                    || wt.ParentItemCode?.includes(_search)
                    || wt.ParentItemCodeDesc?.includes(_search)
            })
            .sort(wtStatusSorter(sort))
    }
)

export default workTicketsListSlice;
