import {SortProps} from "@chumsinc/sortable-tables";
import Decimal from "decimal.js";
import {CLIssue} from "chums-types";

export const itemWarehouseKey = (issue: CLIssue) => `${issue.WarehouseCode}/${issue.ItemCode}`;

export const quantityDue = (issue: CLIssue) => {
    return issue.DateReceived ? 0 : issue.QuantityIssued;
}
export const issueListSorter = ({field, ascending}: SortProps<CLIssue>) => (a: CLIssue, b: CLIssue) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'ItemCode':
        case 'WarehouseCode':
        case 'WorkTicketNo':
        case 'DateIssued':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? (itemWarehouseKey(a) === itemWarehouseKey(b)
                            ? a.id - b.id
                            : itemWarehouseKey(a) > itemWarehouseKey(b) ? 1 : -1
                    )
                    : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
            ) * sortMod;
        case 'DateDue':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? ((a.DateReceived ?? '') === (b.DateReceived ?? '')
                            ? a.id - b.id
                            : (a.DateReceived ?? '') > (b.DateReceived ?? '') ? 1 : -1
                    )
                    : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
            ) * sortMod;
        case 'DateReceived':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? ((a.DateDue ?? '') === (b.DateDue ?? '')
                            ? a.id - b.id
                            : (a.DateDue ?? '') > (b.DateDue ?? '') ? 1 : -1
                    )
                    : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
            ) * sortMod;

        case 'QuantityIssued':
        case 'QuantityReceived':
        case 'QuantityRepaired':
        case "CostIssued":
        case 'CostReceived':
        case 'CostAdjustment':
            return (
                new Decimal(a[field]).eq(b[field])
                    ? (itemWarehouseKey(a) === itemWarehouseKey(b)
                            ? a.id - b.id
                            : (itemWarehouseKey(a) > itemWarehouseKey(b) ? 1 : -1)
                    )
                    : (new Decimal(a[field]).sub(b[field]).toNumber())
            ) * sortMod;
        case 'QuantityDue':
            return (
                new Decimal(quantityDue(a)).eq(quantityDue(b))
                    ? (a.id - b.id)
                    : (new Decimal(quantityDue(a)).sub(new Decimal(quantityDue(b))).toNumber())
            ) * sortMod;
        case 'VendorNo':
        case 'VendorName':
            return (
                a[field] === b[field]
                    ? (a.id - b.id)
                    : a[field].localeCompare(b[field])
            ) * sortMod
        case 'id':
        default:
            return (a.id - b.id) * sortMod;
    }
}
