import {SortProps, WorkTemplateStep} from "chums-types";
import {CLIssueDetail, CLIssueEntryDetail, WorkTicketStep} from "../../types";
import Decimal from "decimal.js";
import {stepRate} from "@/ducks/templates/utils";
import {emptyCLEntryDetail} from "@/ducks/issue-entry/issueEntrySlice";

export const issueDetailKey = (line: Pick<CLIssueDetail | CLIssueEntryDetail, 'id' | 'StepNo'>) => {
    return `${line.StepNo ?? '-'}:${line.id ?? 0}`;
}
export const issueDetailSorter = ({
                                      field,
                                      ascending
                                  }: SortProps<CLIssueDetail | CLIssueEntryDetail>) => (a: CLIssueDetail | CLIssueEntryDetail, b: CLIssueDetail | CLIssueEntryDetail) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'StepNo':
            return ((a.StepNo ?? '') === (b.StepNo ?? '')
                    ? (a.id ?? 0) - (b.id ?? 0)
                    : (a.StepNo ?? '') > (b.StepNo ?? '') ? 1 : -1
            ) * sortMod;
        case 'id':
        default:
            return ((a.id ?? 0) - (b.id ?? 0)) * sortMod;
    }
}

export const newIssueDetailRow = (row: WorkTicketStep, quantity: number | string, index?: number): CLIssueEntryDetail => {
    return ({
        id: 0,
        TemplateNo: row.SourceTemplateNo,
        RevisionNo: row.SourceTemplateRevisionNo,
        StepNo: row.StepNo,
        WorkCenter: row.WorkCenter,
        ActivityCode: row.ActivityCode,
        QuantityIssued: new Decimal(quantity).div(row.ScalingFactorMaterials).floor().toString(),
        ActivityRate: activityRate(row),
        ScalingFactor: row.ScalingFactorMaterials,
        ScalingMethod: row.ScalingMethod,
        StepDescription: row.StepDesc,
        selected: true,
    })
}

export const detailRowsFromSteps = (steps: WorkTemplateStep[], quantityIssued: string | number): CLIssueEntryDetail[] => {
    return steps
        .filter(row => row.WorkCenter === 'CON')
        .map(step => ({
            ...emptyCLEntryDetail,
            StepNo: step.StepNo,
            WorkCenter: step.WorkCenter,
            ActivityCode: step.ActivityCode,
            StepDescription: step.TemplateDesc,
            QuantityIssued: quantityIssued,
            ActivityRate: stepRate(step),
            ScalingMethod: step.ScalingMethod,
            ScalingFactor: step.ScalingFactorMaterials,
            selected: true,
        }))
}

export const activityRate = (props: Pick<WorkTicketStep, 'ScalingFactorMaterials' | 'RevisedBudgetLaborCost' | 'ScalingMethod' | 'ScalingFactorLabor' | 'RevisedBudgetHours'>) => {
    const {
        ScalingFactorLabor,
        ScalingFactorMaterials,
        ScalingMethod,
        RevisedBudgetLaborCost,
        RevisedBudgetHours
    } = props;
    switch (ScalingMethod) {
        case 'Y': // Number of parents per template
            return new Decimal(RevisedBudgetLaborCost)
                .div(RevisedBudgetHours)
                .div(ScalingFactorLabor)
                .times(ScalingFactorMaterials ?? 1)
                .toDecimalPlaces(3).toString();
        case 'M': // Number of templates per parent
            return new Decimal(ScalingFactorLabor)
                .div(new Decimal(RevisedBudgetLaborCost).div(RevisedBudgetHours))
                .times(ScalingFactorMaterials ?? 1)
                .toDecimalPlaces(3).toString();
        default:
            return RevisedBudgetLaborCost;
    }
}

export const activityIssueCost = (row: CLIssueEntryDetail | CLIssueDetail): string => {
    return new Decimal(row.QuantityIssued).times(row.ActivityRate ?? 0).toDecimalPlaces(2).toString();
}

export const activityReceiptCost = (row: CLIssueDetail): string => {
    return new Decimal(row.QuantityReceived ?? 0).times(row.ActivityRate ?? 0).toDecimalPlaces(2).toString();
}


export const calcCostIssued = (rows: CLIssueEntryDetail[]): string => {
    return rows.filter(row => row.selected)
        .reduce(
            (pv, row) => new Decimal(activityIssueCost(row)).add(pv),
            new Decimal('0')
        )
        .toString();
}

export const calcCostReceived = (rows: CLIssueDetail[], fixes:number|string): string => {
    return rows
        .reduce(
            (pv, row) => new Decimal(activityReceiptCost(row)).add(pv),
            new Decimal('0')
        )
        .add(new Decimal(fixes).times(0.02))
        .toString();
}
