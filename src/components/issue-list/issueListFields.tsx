import {SortableTableField} from "@chumsinc/sortable-tables";
import {CLIssue} from "chums-types";
import {friendlyDate} from "@/utils/dates";
import numeral from "numeral";
import IssueLink from "@/components/IssueLink";

export const fields: SortableTableField<CLIssue>[] = [
    {field: 'id', title: 'ID', sortable: true, render: (row) => <IssueLink issueId={row.id} vendorNo={row.VendorNo} />},
    {field: 'VendorNo', title: 'Vendor', sortable: true},
    {field: 'WarehouseCode', title: 'Whs', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'WorkTicketNo', title: 'W/T#', sortable: true, render: (row) => row.WorkTicketNo.replace(/^0+/, '')},
    {
        field: 'ActivityCodes',
        title: 'Operations',
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
        render: (row) => numeral(row.QuantityReceived).format('0,0'),
        align: 'end'
    },
    {
        field: 'QuantityRepaired',
        title: "Repairs",
        sortable: true,
        render: (row) => numeral(row.QuantityRepaired).format('0,0'),
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
