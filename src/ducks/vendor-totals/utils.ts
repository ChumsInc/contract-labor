import {SortProps} from "@chumsinc/sortable-tables";
import {VendorWeekTotal} from "../../types";
import Decimal from "decimal.js";

export const defaultVendorSort:SortProps<VendorWeekTotal> = {field: 'VendorNo', ascending: true};

export const sortVendorTotals = ({
                                     field,
                                     ascending
                                 }: SortProps<VendorWeekTotal>) => (a: VendorWeekTotal, b: VendorWeekTotal) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'VendorNo':
        case 'VendorName':
            return ((a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                ? (a.id - b.id)
                : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)) * sortMod
        case 'QuantityIssued':
        case 'QuantityIssuedWeek':
        case 'CostIssued':
        case 'CostIssuedWeek':
        case 'QuantityDueToday':
        case 'QuantityDueThisWeek':
        case 'QuantityDueFuture':
            return (new Decimal(a[field]).eq(b[field])
                ? (a.VendorNo.toLowerCase() === b.VendorNo.toLowerCase()
                    ? (a.id - b.id)
                    : (a.VendorNo.toLowerCase() > b.VendorNo.toLowerCase() ? 1 : -1))
                : new Decimal(a[field]).sub(b[field]).toNumber()) * sortMod;
        case "id":
        default:
            return (a.id - b.id) * sortMod;

    }
}
