export interface Vendor {
    id: number;
    Company: string;
    VendorNo: string;
    VendorName: string|null;
    VendorNameOverride: string;
    active: boolean;
    VendorStatus: 'A'|'I'|'T'|null;
    AddressLine1: string|null;
    AddressLine2: string|null;
    AddressLine3: string|null;
    City: string|null;
    State: string|null;
    ZipCode: string|null;
    CountryCode: string|null;
    EmailAddress: string|null;
}

export interface VendorWeekTotal extends Vendor {
    QuantityIssued: string | number;
    CostIssued: string | number;
    QuantityIssuedWeek: string | number;
    CostIssuedWeek: string | number;
    QuantityDueToday: string|number;
    QuantityDueThisWeek: string|number;
    QuantityDueFuture: string|number;
}

export interface CLIssue {
    id: number;
    VendorNo: string;
    VendorName: string;
    WarehouseCode: string;
    ItemCode: string;
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
    id?: number;
    CLIssueID?: number;
    TemplateNo: string | null;
    RevisionNo: string | null;
    StepNo: string | null;
    WorkCenter: string;
    ActivityCode: string;
    StepDescription: string | null;
    QuantityIssued: number | string;
    ActivityRate?: number | string | null;                 // wts.RevisedBudgetLaborCost / wts.RevisedBudgetHours / wts.ScalingLaborFactor, wts = PM_WorkTicketStep table
    PlannedPieceCostDivisor: number | string;
    ScalingMethod: WorkTicketScalingMethod;
    ScalingFactor: number | string | null
    QuantityReceived: number | string | null;
    QuantityAdjusted: number | string | null;
}

export type WorkTicketStatus = 'O' | 'Q' | 'R'; // Open, Estimate/Quote, Released
export type WorkTicketType = 'I' | 'S' | 'A'; // Inventory, Sales Order, Assembly (Work Ticket)

export interface WorkTicketHeader {
    WorkTicketKey: string;
    WorkTicketNo: string;
    WorkTicketDate: string;
    WorkTicketStatus: WorkTicketStatus;
    WorkTicketType: WorkTicketType;
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
}

export interface CLIssueEntry extends Pick<CLIssue, 'id' | 'VendorNo' | 'WorkTicketNo' | 'WarehouseCode' | 'ItemCode' | 'QuantityIssued' | 'DateIssued' | 'DateDue'> {
    id: number | null;
    VendorNo: string | null;
    WorkTicketNo: string | null;
    ItemCode: string | null;
    DateIssued: string | null;
    DateDue: string | null;
    Notes: string|null;
}

export interface CLIssueEntryDetail extends Pick<CLIssueDetail, 'id' | 'WorkCenter' | 'ActivityCode' | 'StepDescription' | 'QuantityIssued' | 'ActivityRate'|'ScalingMethod'|'ScalingFactor'> {
    selected?: boolean;
}
