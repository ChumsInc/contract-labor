import {SortProps} from "chums-components";
import {CLIssue} from "../../types";
import Decimal from "decimal.js";

export const itemWarehouseKey = (issue:CLIssue) => `${issue.WarehouseCode}/${issue.ItemCode}`;

export const issueListSorter = ({field, ascending}:SortProps<CLIssue>) => (a:CLIssue, b:CLIssue) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'ItemCode':
        case 'WarehouseCode':
        case 'WorkTicketNo':
        case 'DateIssued':
        case 'DateDue':
        case 'DateReceived':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? (itemWarehouseKey(a) === itemWarehouseKey(b)
                        ? a.id - b.id
                        : (itemWarehouseKey(a) > itemWarehouseKey(b) ? 1 : -1)
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

        case 'id':
        default:
            return (a.id - b.id) * sortMod;
    }
}
