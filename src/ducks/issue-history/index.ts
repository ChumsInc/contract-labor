import {CLIssue, CLIssueEntry} from "../../types";
import {createReducer} from "@reduxjs/toolkit";

export interface IssueHistoryState {
    list: CLIssue[];
    loading: boolean;
    filters: {
        id: number;
        vendorNo: string;
        warehouseCode: string;
        itemCode: string;
        activityCode: string;
        workTicketNo: string;
        minDate: string;
        maxDate: string;
    }
}

export const initialState: IssueHistoryState = {
    list: [],
    loading: false,
    filters: {
        id: 0,
        vendorNo: '',
        warehouseCode: '',
        itemCode: '',
        activityCode: '',
        workTicketNo: '',
        minDate: '',
        maxDate: '',
    },
}

const issueHistoryReducer = createReducer(initialState, builder => {

});

export default issueHistoryReducer;
