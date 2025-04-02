import {SortProps} from "@chumsinc/sortable-tables";
import {WorkTicketStatusEntry, WorkTicketStatusGroup, WorkTicketWorkStatusItem} from "../../types";
import Decimal from "decimal.js";

const wtStatusEntrySorter = (a:WorkTicketStatusEntry|undefined, b:WorkTicketStatusEntry|undefined) => {
    return (a?.style ?? 0) === (b?.style ?? 0)
        ? ((a?.date ?? '') === (b?.date ?? '') ? 0 : ((a?.date ?? '') > (b?.date ?? '') ? 1 : -1))
        : ((a?.style ?? 0) > (b?.style ?? 0) ? 1 : -1)
}

const defaultWTStatusSorter = (a:WorkTicketWorkStatusItem, b:WorkTicketWorkStatusItem) => {
    return a.WorkTicketNo > b.WorkTicketNo ? 1 : -1
}
export const wtStatusSorter = ({
                                   field,
                                   ascending
                               }: SortProps<WorkTicketWorkStatusItem> | SortProps<WorkTicketStatusGroup>) =>
    (a: WorkTicketWorkStatusItem, b: WorkTicketWorkStatusItem) => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'WorkTicketNo':
            case 'WorkTicketKey':
                return defaultWTStatusSorter(a, b) * sortMod;
            case 'ParentItemCode':
            case 'ParentItemCodeDesc':
            case 'ProductionDueDate':
            case 'ParentWarehouseCode':
                return (
                    a[field] === b[field]
                        ? (a.WorkTicketNo > b.WorkTicketNo ? 1 : -1)
                        : (a[field] > b[field] ? 1 : -1)
                ) * sortMod;
            case 'QuantityCompleted':
            case 'QuantityOrdered':
                return (
                    new Decimal(a[field]).eq( b[field])
                        ? defaultWTStatusSorter(a, b)
                        : (new Decimal(a[field]).gt(b[field]) ? 1 : -1)
                ) * sortMod;
            case 'rush':
                return (
                    wtStatusEntrySorter(a.StatusJSON[field], b.StatusJSON[field])
                    || defaultWTStatusSorter(a, b)
                ) * sortMod * -1;
            case 'cut':
            case 'cl':
            case 'mold':
            case 'prd':
            case 'card':
                return (
                    wtStatusEntrySorter(a.StatusJSON[field], b.StatusJSON[field])
                    || defaultWTStatusSorter(a, b)
                ) * sortMod;
            default:
                return defaultWTStatusSorter(a, b) * sortMod;
        }
    }
