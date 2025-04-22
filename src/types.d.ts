import {WorkTicketStatusSet} from "chums-types";

export interface Vendor {
    id: number;
    Company: string;
    VendorNo: string;
    VendorName: string | null;
    VendorNameOverride: string;
    active: boolean;
    VendorStatus: 'A' | 'I' | 'T' | null;
    AddressLine1: string | null;
    AddressLine2: string | null;
    AddressLine3: string | null;
    City: string | null;
    State: string | null;
    ZipCode: string | null;
    CountryCode: string | null;
    EmailAddress: string | null;
}

export interface VendorWeekTotal extends Vendor {
    QuantityIssued: string | number;
    QuantityIssuedWeek: string | number;
    QuantityDueToday: number|string;
    QuantityDueThisWeek: number|string;
    QuantityDueFuture: number|string;
    CostIssued: string | number;
    CostIssuedWeek: string | number;
    CostDueToday: number | string;
    CostDueThisWeek: number | string;
    CostDueFuture: number | string;
}

export interface CLIssue {
    id: number;
    VendorNo: string;
    VendorName: string;
    WarehouseCode: string;
    ItemCode: string;
    ItemCodeDesc?: string|null;
    WorkTicketNo: string;
    WorkTicketKey: string | null;
    TemplateNo: string | null;
    ActivityCodes: string;
    WorkTicketStatus: string | null;
    ProductionDueDate: string | null;
    UnitCost: string | number;
    QuantityIssued: string | number;
    CostIssued: string | number;
    DateIssued: string;
    DateDue: string;
    UserIssued: string;
    UserReceived: string | null;
    QuantityReceived: string | number;
    CostReceived: string | number;
    DateReceived: string | null;
    QuantityRepaired: string | number;
    CostAdjustment: string | number;
    Notes: string | null;
    timestamp: string;
}

export interface CLIssueDetail {
    id: number;
    CLIssueID: number;
    TemplateNo: string | null;
    RevisionNo: string | null;
    StepNo: string | null;
    WorkCenter: string;
    ActivityCode: string;
    StepDescription: string | null;
    QuantityIssued: number | string;
    ActivityRate?: number | string | null;                 // wts.RevisedBudgetLaborCost / wts.RevisedBudgetHours / wts.ScalingLaborFactor, wts = PM_WorkTicketStep table
    ScalingMethod: WorkTicketScalingMethod;
    ScalingFactor: number | string | null; // a divisor for labor scaling, for example making a bag of 6 will occur qty/6 times.
    QuantityReceived: number | string | null;
    QuantityAdjusted: number | string | null;
}

export type WorkTicketStatus = 'O' | 'Q' | 'R' | 'C' | 'X'; // Open, Estimate/Quote, Released, Closed, Deleted
export type WorkTicketType = 'I' | 'S' | 'A'; // Inventory, Sales Order, Assembly (Work Ticket)

export interface WorkTicketHeader {
    WorkTicketKey: string;
    WorkTicketNo: string;
    WorkTicketDate: string;
    WorkTicketStatus: WorkTicketStatus;
    WorkTicketType: WorkTicketType;
    MakeForSalesOrderNo: string | null;
    MakeForWorkTicketNo: string | null;
    ParentItemCode: string;
    ParentItemCodeDesc: string;
    ParentWarehouseCode: string;
    TemplateNo: string;
    TemplateRevisionNo: string;
    EffectiveDate: string;
    ActualReleaseDate: string;
    ProductionDueDate: string;
    ParentUnitOfMeasure: string;
    QuantityOrdered: number | string;
    QuantityPlanned: number | string;
    QuantityCompleted: number | string;
    ParentUnitOfMeasureConvFactor: number | string;
}

export type WorkTicketScalingMethod = 'N' | 'P' | 'Y' | 'M'; // N = No Scaling, P = Production Run, Y = No. of parents per template, M = No of templates per parent
export interface WorkTicketStep {
    WorkTicketKey: string;
    LineKey: string;
    StepNo: string;
    LineSeqNo: string;
    StepDesc: string;
    ActivityCode: string;
    WorkCenter: string;
    SourceTemplateNo: string;
    SourceTemplateRevisionNo: string;
    TemplateStepNo: string;
    ScalingMethod: WorkTicketScalingMethod;
    RevisedBudgetHours: string | number;
    RevisedBudgetLaborCost: string | number;
    ScalingFactorLabor: string | number;
    ScalingFactorMaterials: string | number;
}

export interface CLIssueEntry extends Pick<CLIssue, 'id' | 'VendorNo' | 'WorkTicketNo' | 'TemplateNo'
    | 'WarehouseCode' | 'ItemCode' | 'ItemCodeDesc' | 'QuantityIssued' | 'CostIssued' | 'UnitCost'
    | 'DateIssued' | 'DateDue'> {
    id: number | null;
    VendorNo: string | null;
    ItemCode: string | null;
    DateIssued: string | null;
    DateDue: string | null;
    Notes: string | null;
    detail?: CLIssueEntryDetail[];
}

export interface CLIssueEntryDetail extends Pick<CLIssueDetail, 'TemplateNo'|'RevisionNo'|'StepNo' | 'WorkCenter' | 'ActivityCode'
    | 'StepDescription' | 'QuantityIssued' | 'ActivityRate' | 'ScalingMethod' | 'ScalingFactor'> {
    id: number;
    selected?: boolean;
}

export type CLIssueEntryDetailPost = Pick<CLIssueDetail, 'id'|'StepNo'|'QuantityIssued'>;

export interface WorkTicketResponse {
    header: WorkTicketHeader | null;
    steps: WorkTicketStep[];
    issues: CLIssue[];
}

export interface CLIssueResponse {
    issue: CLIssue | null;
    detail: CLIssueDetail[],
}

export type IssueDateType = 'I'|'R'|'D';

export interface IssueSearchOptions {
    dateType: IssueDateType;
    minDate: string;
    maxDate: string;
    vendorNo?: string | null;
    warehouseCode?: string | null;
    itemCode?: string | null;
    activityCode?: string|null;
    templateNo?: string|null;
}
export interface IssueSearchWorkTicket {
    workTicketNo: string;
}
export interface IssueSearchId {
    id: number|string;
}
export type IssueSearchParams = IssueSearchOptions|IssueSearchWorkTicket|IssueSearchId;


export type WorkTicketWorkStatusKey = 'comment'|'rush'|'cut'|'cl'|'mold'|'prd'|'card';
export interface WorkTicketStatusEntry {
    user: number;
    style: number;
    date: string;
    text?: string;
}

export type WorkTicketStatusGroup = Record<WorkTicketWorkStatusKey, WorkTicketStatusEntry|undefined>

export interface WorkTicketWorkStatusItem extends Pick<WorkTicketHeader,
    'WorkTicketKey'|'WorkTicketNo'|'ParentItemCode'|'ParentWarehouseCode'|'ProductionDueDate'|
    'QuantityOrdered'|'QuantityCompleted'|'ParentItemCodeDesc'|'MakeForWorkTicketNo'|'MakeForSalesOrderNo'
> {
    StatusJSON: WorkTicketStatusSet;
    WorkCenters: string[];
}

export interface WorkTicketWorkStatusGroup {
    id: number;
    name: string;
}

export interface SearchItem {
    ItemCode: string;
    ItemCodeDesc: string;
    ProductType: string;
    ProductLine: string;
    Category1: string | null;
    UDF_UPC: string | null;
    UDF_UPC_BY_COLOR: string | null;
    SuggestedRetailPrice: string | number;
    filename: string | null;
    b2bItem: string | null;
    ProductStatus: string | null;
}

export interface PostWorkTicketStatusProps {
    WorkTicketKey: string;
    action: string;
    nextStatus: number;
}
