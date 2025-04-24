import {CLIssue, IssueDateType, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LocalStore} from "@chumsinc/ui-utils";
import {historySort} from "@/utils/storageKeys";
import {loadHistory} from "@/ducks/issue-history/actions";
import {dismissAlert} from "@chumsinc/alert-list";
import {issueListSorter} from "@/ducks/issue-list/utils";
import dayjs from "dayjs";

const adapter = createEntityAdapter<CLIssue, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const selectors = adapter.getSelectors();


export interface IssueHistoryExtraState {
    loading: 'idle' | 'loading' | 'rejected';
    id: number;
    vendorNo: string;
    warehouseCode: string;
    itemCode: string;
    activityCode: string;
    workTicketNo: string;
    dateType: IssueDateType;
    minDate: string;
    maxDate: string;
    sort: SortProps<CLIssue>;
}

const extraState: IssueHistoryExtraState = {
    id: 0,
    vendorNo: '',
    warehouseCode: '',
    itemCode: '',
    activityCode: '',
    workTicketNo: '',
    dateType: 'I',
    minDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    maxDate: dayjs().format('YYYY-MM-DD'),
    loading: 'idle',
    sort: LocalStore.getItem(historySort, {field: 'id', ascending: true}),
}

const issueHistorySlice = createSlice({
    name: 'issueHistory',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setVendorNo: (state, action) => {
            state.vendorNo = action.payload;
        },
        setWarehouseCode: (state, action) => {
            state.warehouseCode = action.payload;
        },
        setItemCode: (state, action) => {
            state.itemCode = action.payload;
        },
        setWorkTicketNo: (state, action) => {
            state.workTicketNo = action.payload;
        },
        setDateType: (state, action: PayloadAction<IssueDateType>) => {
            state.dateType = action.payload;
        },
        setMinDate: (state, action) => {
            state.minDate = action.payload;
        },
        setMaxDate: (state, action) => {
            state.maxDate = action.payload;
        },
        setActivityCode: (state, action) => {
            state.activityCode = action.payload;
        },
        setSort: (state, action) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadHistory.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loadHistory.fulfilled, (state, action) => {
                state.loading = 'idle';
                adapter.setAll(state, action.payload);
            })
            .addCase(loadHistory.rejected, (state) => {
                state.loading = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadHistory.typePrefix) {
                    state.loading = 'idle';
                }
            });
    },
    selectors: {
        selectList: (state) => selectors.selectAll(state),
        selectId: (state) => state.id,
        selectVendorNo: (state) => state.vendorNo,
        selectWarehouseCode: (state) => state.warehouseCode,
        selectItemCode: (state) => state.itemCode,
        selectActivityCode: (state) => state.activityCode,
        selectWorkTicketNo: (state) => state.workTicketNo,
        selectDateType: (state) => state.dateType,
        selectMinDate: (state) => state.minDate,
        selectMaxDate: (state) => state.maxDate,
        selectHistoryLoading: (state) => state.loading !== 'idle',
        selectSort: (state) => state.sort,
    }
});

export const {
    setId,
    setActivityCode,
    setItemCode,
    setWarehouseCode,
    setDateType,
    setMaxDate,
    setMinDate,
    setWorkTicketNo,
    setVendorNo,
    setSort
} = issueHistorySlice.actions;

export const {
    selectList,
    selectItemCode,
    selectActivityCode,
    selectWarehouseCode,
    selectVendorNo,
    selectMaxDate,
    selectMinDate,
    selectId,
    selectWorkTicketNo,
    selectHistoryLoading,
    selectSort,
    selectDateType,
} = issueHistorySlice.selectors;

export const selectSortedHistory = createSelector(
    [selectList, selectItemCode, selectActivityCode, selectWarehouseCode, selectVendorNo, selectWorkTicketNo, selectSort],
    (list, itemCode, activityCode, warehouseCode, vendorNo, workTicketNo, sort) => {
        return list
            .filter(row => !itemCode || row.ItemCode.startsWith(itemCode))
            .filter(row => !activityCode || row.ActivityCodes.includes(activityCode))
            .filter(row => !warehouseCode || row.WarehouseCode === warehouseCode)
            .filter(row => !vendorNo || row.VendorNo === vendorNo)
            .filter(row => !workTicketNo || row.WorkTicketNo.includes(workTicketNo))
            .sort(issueListSorter(sort))
    }
)

export default issueHistorySlice;
