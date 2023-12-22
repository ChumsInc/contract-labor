import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {issueListSorter} from "./utils";

export const selectIssueListLoading = (state:RootState) => state.issue.loading;
export const selectIssueList = (state:RootState) => state.issue.list;
export const selectIssueListSort =(state:RootState) => state.issue.sort;
export const selectIssueCurrentVendorNo = (state:RootState) => state.issue.current.vendorNo;

export const selectSortedIssueList = createSelector(
    [selectIssueList, selectIssueListSort, selectIssueCurrentVendorNo],
    (list, sort, vendorNo) => {
        return list
            .filter(issue => issue.VendorNo === vendorNo)
            .sort(issueListSorter(sort));
    }
);
