import {CLIssue, CLIssueEntry, CLIssueEntryDetail} from "../../types";
import {Editable} from "chums-types/src/generics";
import {
    CaseReducer,
    createEntityAdapter,
    createSelector,
    createSlice,
    EntityState,
    PayloadAction
} from "@reduxjs/toolkit";
import {loadCLIssueEntry, saveCLIssueEntry, setIssueDate} from "./actions";
import {setCurrentWorkTicket} from "../work-ticket/actions";
import Decimal from "decimal.js";
import {calcCostIssued, detailRowsFromSteps, issueDetailKey, issueDetailSorter, newIssueDetailRow} from "./utils";
import dayjs from "dayjs";
import {SortProps, WorkTemplate} from "chums-types";
import {dismissAlert} from "@chumsinc/alert-list";


const issueDetailAdapter = createEntityAdapter<CLIssueEntryDetail & Editable, string>({
    selectId: (arg) => issueDetailKey(arg),
    sortComparer: (a, b) => issueDetailKey(a).localeCompare(issueDetailKey(b))
});

const issueDetailSelectors = issueDetailAdapter.getSelectors();

export interface IssueEntryState {
    issueId: number;
    header: (CLIssueEntry | CLIssue) & Editable;
    status: 'loading' | 'saving' | 'deleting' | 'idle' | 'rejected';
}

export const defaultDetailSort: SortProps<CLIssueEntryDetail> = {field: 'StepNo', ascending: true};

const emptyCLEntry:CLIssueEntry = {
    id: 0,
    VendorNo: '',
    WorkTicketNo: '',
    TemplateNo: '',
    WarehouseCode: '',
    ItemCode: '',
    QuantityIssued: 0,
    CostIssued: 0,
    UnitCost: 0,
    DateIssued: null,
    DateDue: null,
    Notes: '',
}
export const newCLEntry = (): CLIssueEntry => ({
    id: 0,
    VendorNo: '',
    WorkTicketNo: '',
    TemplateNo: '',
    WarehouseCode: '',
    ItemCode: '',
    QuantityIssued: 0,
    CostIssued: 0,
    UnitCost: 0,
    DateIssued: dayjs().toISOString(),
    DateDue: null,
    Notes: '',
})

export const emptyCLEntryDetail: CLIssueEntryDetail = {
    id: 0,
    TemplateNo: '',
    RevisionNo: '',
    StepNo: '',
    WorkCenter: 'CON',
    ActivityCode: '',
    StepDescription: '',
    QuantityIssued: 0,
    ActivityRate: 0,
    ScalingMethod: 'N',
    ScalingFactor: 0,
}

export const initialState = (): IssueEntryState => ({
    issueId: 0,
    header: {
        ...newCLEntry(),
    },
    status: 'idle',
})

const updateHeaderCosts: CaseReducer<IssueEntryState & EntityState<CLIssueEntryDetail & Editable, string>> = (state) => {
    state.header.CostIssued = calcCostIssued(issueDetailSelectors.selectAll(state));
    state.header.UnitCost = new Decimal(state.header.QuantityIssued).eq(0)
        ? 0
        : new Decimal(state.header.CostIssued).div(state.header.QuantityIssued).toString();
}

const issueEntrySlice = createSlice({
    name: "issueEntry",
    initialState: issueDetailAdapter.getInitialState(initialState()),
    reducers: {
        setNewEntry: (state, action: PayloadAction<CLIssueEntry>) => {
            state.header = action.payload;
            issueDetailAdapter.removeAll(state);
        },
        setEntryTemplate: (state, action: PayloadAction<WorkTemplate | null>) => {
            state.header.TemplateNo = action.payload?.TemplateNo ?? null;
            issueDetailAdapter.setAll(state, detailRowsFromSteps(action.payload?.Steps ?? [], state.header.QuantityIssued))
            updateHeaderCosts(state, action);
        },
        toggleIssueDetailSelected: (state, action: PayloadAction<Pick<CLIssueEntryDetail, 'id' | 'StepNo' | 'selected'>>) => {
            const key = issueDetailKey(action.payload);
            const existing = issueDetailSelectors.selectById(state, key);
            if (!existing) {
                return;
            }
            issueDetailAdapter.updateOne(state, {id: key, changes: {selected: action.payload.selected}});
            updateHeaderCosts(state, action);
        },
        setIssueDetailQuantityIssued: (state, action: PayloadAction<Pick<CLIssueEntryDetail, 'id' | 'StepNo' | 'QuantityIssued'>>) => {
            const key = issueDetailKey(action.payload);
            const existing = issueDetailSelectors.selectById(state, key);
            if (!existing) {
                return;
            }
            issueDetailAdapter.updateOne(state, {id: key, changes: {QuantityIssued: action.payload.QuantityIssued}});
            updateHeaderCosts(state, action);
        },
        updateCurrentEntry: (state, action: PayloadAction<Partial<CLIssueEntry>>) => {
            state.header = {...state.header, ...action.payload, changed: true};
        },
        updateCurrentQuantity: (state, action: PayloadAction<number | string>) => {
            const quantityIssued = action.payload || 0;
            state.header.QuantityIssued = quantityIssued;
            const updates = issueDetailSelectors.selectAll(state).map(row => ({
                id: issueDetailKey(row),
                changes: {
                    QuantityIssued: new Decimal(quantityIssued).div(row.ScalingFactor ?? 1).floor().toString(),
                    changed: true,
                },
            }))
            issueDetailAdapter.updateMany(state, updates);
            updateHeaderCosts(state, action);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setIssueDate, (state, action) => {
                state.header.DateIssued = action.payload;
            })
            .addCase(setCurrentWorkTicket.fulfilled, (state, action) => {
                // new work ticket and work ticket is open or released
                if (!state.header.id && action.payload?.header && ['O', 'R'].includes(action.payload.header.WorkTicketStatus)) {
                    const {
                        WorkTicketNo,
                        TemplateNo,
                        ParentItemCode,
                        ParentItemCodeDesc,
                        ParentWarehouseCode,
                        QuantityOrdered,
                        QuantityCompleted,
                        ParentUnitOfMeasureConvFactor
                    } = action.payload.header;
                    state.header.WorkTicketNo = WorkTicketNo;
                    state.header.TemplateNo = TemplateNo;
                    state.header.ItemCode = ParentItemCode;
                    state.header.ItemCodeDesc = ParentItemCodeDesc ?? null;
                    state.header.WarehouseCode = ParentWarehouseCode;
                    const alreadyIssued = action.payload.issues.reduce((pv, cv) => new Decimal(pv).add(cv.QuantityIssued).toNumber(), 0);
                    state.header.QuantityIssued = Math.max(new Decimal(QuantityOrdered).sub(QuantityCompleted).times(ParentUnitOfMeasureConvFactor).sub(alreadyIssued).toNumber(), 0);

                    const detail = action.payload.steps.filter(row => row.WorkCenter === 'CON')
                        .map((row, index) => newIssueDetailRow(row, state.header.QuantityIssued, index));
                    issueDetailAdapter.setAll(state, detail);
                    updateHeaderCosts(state, action);
                }
            })
            .addCase(loadCLIssueEntry.pending, (state, action) => {
                state.status = 'loading';
                state.header = action.meta.arg;
                issueDetailAdapter.removeAll(state);
            })
            .addCase(loadCLIssueEntry.fulfilled, (state, action) => {
                state.status = 'idle';
                if (action.payload?.issue) {
                    state.header = action.payload.issue;
                    const detail = action.payload.detail
                        .map(line => ({...line, selected: !!line.id}));
                    issueDetailAdapter.setAll(state, detail);
                    updateHeaderCosts(state, action);
                    return;
                }
                state.header = {...newCLEntry()};
                issueDetailAdapter.removeAll(state);
            })
            .addCase(loadCLIssueEntry.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(saveCLIssueEntry.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveCLIssueEntry.fulfilled, (state, action) => {
                state.status = 'idle'
                if (!action.payload?.issue) {
                    state.header = {...emptyCLEntry, DateIssued: state.header.DateIssued};
                    issueDetailAdapter.removeAll(state);
                    return;
                }
                state.header = action.payload.issue;
                issueDetailAdapter.setAll(state, action.payload.detail);
                updateHeaderCosts(state, action);
            })
            .addCase(saveCLIssueEntry.rejected, (state, action) => {
                state.status = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context
                    && [saveCLIssueEntry.typePrefix, loadCLIssueEntry.typePrefix].includes(action.payload.context)) {
                    state.status = 'idle';
                }
            })

    },
    selectors: {
        selectCurrentIssueHeader: (state) => state.header,
        selectCurrentIssueId: (state) => state.header?.id ?? 0,
        selectCurrentIssueDetail: (state) => issueDetailSelectors.selectAll(state),
        selectCurrentIssueStatus: (state) => state.status,
    }
});

export const {
    setEntryTemplate,
    setNewEntry,
    updateCurrentEntry,
    updateCurrentQuantity,
    toggleIssueDetailSelected,
    setIssueDetailQuantityIssued
} = issueEntrySlice.actions;
export const {
    selectCurrentIssueHeader,
    selectCurrentIssueDetail,
    selectCurrentIssueStatus,
    selectCurrentIssueId
} = issueEntrySlice.selectors;

export const selectSortedDetail = createSelector(
    [selectCurrentIssueDetail],
    (list) => {
        return [...list].sort(issueDetailSorter(defaultDetailSort))
    }
)
export default issueEntrySlice
