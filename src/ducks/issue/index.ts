import {CLIssue, CLIssueEntry, CLIssueEntryDetail} from "../../types";
import {Editable} from "chums-types/src/generics";
import {createReducer} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {loadCurrentIssueList, setCurrentIssueVendorNo, setCurrentIssueSort} from "./actions";
import {issueListSorter} from "./utils";
import {setCurrentVendor} from "../vendors/actions";

export interface IssueState {
    list: CLIssue[];
    loading: boolean;
    sort:SortProps<CLIssue>,
    current: {
        vendorNo: string|null;
        issue: CLIssueEntry & Editable;
        detail: (CLIssueEntryDetail & Editable)[];
        loading: boolean;
        saving: boolean;
    }
}

export const emptyCLEntry:CLIssueEntry = {
    id: 0,
    VendorNo: '',
    WorkTicketNo: '',
    WarehouseCode: '',
    ItemCode: '',
    QuantityIssued: 0,
    DateIssued: null,
    DateDue: null,
    Notes: '',
}
export const defaultCLIssueSort:SortProps<CLIssue> = {
    field: 'id',
    ascending: false,
}
export const preferredCLIssueSort:SortProps<CLIssue> = {
    field: 'DateDue',
    ascending: true,
}
export const initialState:IssueState = {
    list: [],
    loading: false,
    sort: {...preferredCLIssueSort},
    current: {
        vendorNo: null,
        issue: {...emptyCLEntry},
        detail: [],
        loading: false,
        saving: false,
    },
}

const issueReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadCurrentIssueList.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loadCurrentIssueList.fulfilled, (state, action) => {
            state.loading = false;
            state.list = [...action.payload].sort(issueListSorter(defaultCLIssueSort));
        })
        .addCase(loadCurrentIssueList.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCurrentIssueVendorNo, (state, action) => {
            state.current.vendorNo = action.payload ?? null;
            if (state.current.issue) {
                state.current.issue.VendorNo = action.payload;
            }
        })
        .addCase(setCurrentIssueSort, (state,action) => {
            state.sort = action.payload;
        })
});

export default issueReducer;
