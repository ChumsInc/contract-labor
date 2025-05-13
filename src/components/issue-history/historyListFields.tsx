import {SortableTableField} from "@chumsinc/sortable-tables";
import {friendlyDate} from "@/utils/dates";
import numeral from "numeral";
import {CLIssue} from "chums-types";
import IssueLink from "@/components/IssueLink";

export const fields: SortableTableField<CLIssue>[] = [
    {field: 'id', title: 'ID', sortable: true, render: (row) => <IssueLink issueId={row.id} vendorNo={row.VendorNo} />},
    {field: 'VendorNo', title: 'Vendor', sortable: true},
    {field: 'WarehouseCode', title: 'Whs', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'WorkTicketNo', title: 'W/T#', sortable: true, render: (row) => row.WorkTicketNo.replace(/^0+/, '')},
    {
        field: 'ActivityCodes',
        title: 'Activity Codes',
        sortable: true,
        render: (row) => row.ActivityCodes?.split(',').join(', ') ?? 'N/A',
    },
    {
        field: 'DateIssued',
        title: 'Date Issued',
        sortable: true,
        render: (row) => friendlyDate(row.DateIssued),
        align: 'end'
    },
    {
        field: 'QuantityIssued',
        title: 'Qty Issued',
        sortable: true,
        render: (row) => numeral(row.QuantityIssued).format('0,0'),
        align: 'end'
    },
    {
        field: 'CostIssued',
        title: 'Cost',
        sortable: true,
        render: (row) => numeral(row.CostIssued).format('0,0.00'),
        align: 'end'
    },
    {field: 'DateDue', title: 'Due', sortable: true, render: (row) => friendlyDate(row.DateDue), align: 'end'},
    {
        field: 'QuantityDue',
        title: 'Qty Due',
        sortable: true,
        render: (row) => {
            return row.DateReceived
                ? '-'
                : numeral(row.QuantityIssued).format('0,0')
        },
        align: 'end'
    },
    {
        field: 'DateReceived',
        title: "Date Rec'd",
        sortable: true,
        render: (row) => friendlyDate(row.DateReceived),
        align: 'end'
    },
    {
        field: 'QuantityReceived',
        title: "Qty Rec'd",
        sortable: true,
        render: (row) => row.DateReceived ? numeral(row.QuantityReceived).format('0,0') : '-',
        align: 'end'
    },
    {
        field: 'QuantityRepaired',
        title: "Repairs",
        sortable: true,
        render: (row) => row.DateReceived ? numeral(row.QuantityRepaired).format('0,0') : '-',
        align: 'end'
    },
    {
        field: 'CostReceived',
        title: "Cost",
        sortable: true,
        render: (row) => numeral(row.CostReceived).format('0,0.00'),
        align: 'end'
    },
]
