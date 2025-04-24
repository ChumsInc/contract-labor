import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SortProps} from "@chumsinc/sortable-tables";
import {loadCurrentIssueList} from "./actions";
import {LocalStore} from "@chumsinc/ui-utils";
import {localStorageKeys} from "@/app/settings";
import {issueListSorter} from "@/ducks/issue-list/utils";
import {receiveCLIssue, removeCLIssueEntry, removeCLReceipt, saveCLIssueEntry} from "@/ducks/issue-entry/actions";
import {dismissAlert} from "@chumsinc/alert-list";
import {CLIssue} from "chums-types";

const issueAdapter = createEntityAdapter<CLIssue, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id
})

const issueSelectors = issueAdapter.getSelectors();

export interface IssueListExtraState {
    status: 'loading' | 'idle' | 'rejected';
    sort: SortProps<CLIssue>;
    filters: {
        vendorNo: string;
        search: string;
        showCompleted: boolean;
    }
}


export const preferredCLIssueSort: SortProps<CLIssue> = {
    field: 'DateDue',
    ascending: true,
}
export const extraState: IssueListExtraState = {
    status: 'idle',
    sort: LocalStore.getItem(localStorageKeys.entryList.sort, {...preferredCLIssueSort}),
    filters: {
        vendorNo: '',
        search: '',
        showCompleted: LocalStore.getItem<boolean>(localStorageKeys.entryList.showCompleted, false),
    }
}

const issueListSlice = createSlice({
    name: 'issueList',
    initialState: issueAdapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<CLIssue>>) => {
            LocalStore.setItem(localStorageKeys.entryList.sort, action.payload);
            state.sort = action.payload;
        },
        filterVendorNo: (state, action: PayloadAction<string>) => {
            state.filters.vendorNo = action.payload;
        },
        filterSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },
        filterShowCompleted: (state, action: PayloadAction<boolean>) => {
            LocalStore.setItem(localStorageKeys.entryList.showCompleted, action.payload);
            state.filters.showCompleted = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadCurrentIssueList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadCurrentIssueList.fulfilled, (state, action) => {
                state.status = 'idle';
                issueAdapter.setAll(state, action.payload);
            })
            .addCase(loadCurrentIssueList.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeCLIssueEntry.fulfilled, (state, action) => {
                state.status = 'idle';
                issueAdapter.removeOne(state, action.meta.arg.id ?? 0);
            })
            .addCase(saveCLIssueEntry.fulfilled, (state, action) => {
                if (action.payload?.issue) {
                    issueAdapter.setOne(state, action.payload.issue);
                }
            })
            .addCase(receiveCLIssue.fulfilled, (state, action) => {
                if (action.payload.issue) {
                    issueAdapter.setOne(state, action.payload.issue);
                }
            })
            .addCase(removeCLReceipt.fulfilled, (state, action) => {
                if (action.payload.issue) {
                    issueAdapter.setOne(state, action.payload.issue);
                }
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadCurrentIssueList.typePrefix) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectSort: (state) => state.sort,
        selectStatus: (state) => state.status,
        selectFilterVendorNo: (state) => state.filters.vendorNo,
        selectFilterSearch: (state) => state.filters.search,
        selectFilterShowCompleted: (state) => state.filters.showCompleted,
        selectAll: (state) => issueSelectors.selectAll(state),
    }
})

export const {setSort, filterShowCompleted, filterVendorNo, filterSearch} = issueListSlice.actions;
export const {
    selectSort,
    selectAll,
    selectFilterShowCompleted,
    selectFilterVendorNo,
    selectFilterSearch,
    selectStatus
} = issueListSlice.selectors;

export const selectFilteredIssueList = createSelector(
    [selectAll, selectFilterShowCompleted, selectFilterVendorNo, selectFilterSearch, selectSort],
    (list, showCompleted, vendorNo, search, sort) => {
        const _search = search.toLowerCase().trim();
        return list
            .filter(row => showCompleted || !row.DateReceived)
            .filter(row => !vendorNo || row.VendorNo === vendorNo.toUpperCase())
            .filter(row => !_search
                || String(row.id).includes(_search)
                || row.WorkTicketNo.includes(_search)
                || row.ItemCode.toLowerCase().includes(_search)
                || row.ItemCodeDesc?.toLowerCase().includes(_search)
                || row.ActivityCodes?.toLowerCase().includes(_search))
            .sort(issueListSorter(sort))
    }

)

export default issueListSlice;
