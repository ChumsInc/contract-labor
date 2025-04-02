import {WorkTemplate, WorkTemplateStep} from "chums-types";
import Decimal from "decimal.js";

export const workTemplateSorter = (a:WorkTemplate, b:WorkTemplate) => a.TemplateNo > b.TemplateNo ? 1 : -1;

export const isStepsList = (steps:number|WorkTemplateStep[]): steps is WorkTemplateStep[] => {
    return typeof steps !== 'number' && steps.length !== undefined;
}

export const stepRate = (step:WorkTemplateStep):string|number => {
    switch (step.ScalingMethod) {
        case 'Y':
            return new Decimal(step.BudgetLaborCost).div(step.ScalingFactorLabor).toDecimalPlaces(4).toString();
        case 'M':
            return new Decimal(step.ScalingFactorLabor).div(step.BudgetLaborCost).toDecimalPlaces(4).toString();
        default:
            return step.BudgetLaborCost
    }
}
