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
        TemplateNo: row.SourceTemplateNo,
        RevisionNo: row.SourceTemplateRevisionNo,
        StepNo: row.StepNo,
        WorkCenter: row.WorkCenter,
        ActivityCode: row.ActivityCode,
        QuantityIssued: new Decimal(quantity).div(row.ScalingFactorMaterials).floor().toString(),
        ActivityRate: activityRate(row),
        ScalingFactor: 1,
        ScalingFactorMaterials: row.ScalingFactorMaterials,
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
        case 'Y':
            return new Decimal(RevisedBudgetLaborCost).div(RevisedBudgetHours).div(ScalingFactorLabor).times(ScalingFactorMaterials ?? 1).toDecimalPlaces(3).toString();
        case 'M':
            return new Decimal(ScalingFactorLabor).div(new Decimal(RevisedBudgetLaborCost).div(RevisedBudgetHours)).times(ScalingFactorMaterials ?? 1).toDecimalPlaces(3).toString();
        default:
            return RevisedBudgetLaborCost;
    }
}

export const calcCostIssued = (rows: CLIssueEntryDetail[]): string => {
    return rows.filter(row => row.selected)
        .reduce((pv, row) => new Decimal(row.QuantityIssued).div(row.ScalingFactor ?? 1).times(row.ActivityRate ?? 0).toDecimalPlaces(2).add(pv), new Decimal('0'))
        .toString();
}


export const issueDetailTotal = (detail: (CLIssueEntryDetail)[]): string | number => {
    return detail
        .filter(detail => detail.selected)
        .reduce((pv, cv) => new Decimal(cv.ActivityRate ?? 0)
                .times(cv.QuantityIssued)
                .div(cv.ScalingFactor ?? 1)
                .add(pv).toString(),
            '0');

}
