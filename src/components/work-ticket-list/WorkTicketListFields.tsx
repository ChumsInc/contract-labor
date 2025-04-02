import React from 'react';
import {SortableTableField} from "@chumsinc/sortable-tables";
import {WorkTicketTableRow} from "@/ducks/work-ticket/types";
import {friendlyDate} from "@/utils/dates";
import WorkTicketStatusBadge from "@/components/work-ticket-list/WorkTicketStatusBadge";
import numeral from "numeral";

export const fields: SortableTableField<WorkTicketTableRow>[] = [
    {field: 'WorkTicketNo', title: 'W/T', sortable: true, render: (row) => row.WorkTicketNo.replace(/^0+/, '')},
    {field: 'ProductionDueDate', title: 'Due', sortable: true, render: (row) => friendlyDate(row.ProductionDueDate)},
    {field: 'ParentWarehouseCode', title: 'Whse', sortable: true},
    {field: 'ParentItemCode', title: 'Item', sortable: true},
    // {field: 'ParentItemCodeDesc', title: 'Item Desc', sortable: true},
    {
        field: "rush",
        title: 'Rush',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="Rush" status={row.StatusJSON.rush}/>,
        align: 'center'
    },
    {
        field: "cut",
        title: 'Cut',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="Cut" status={row.StatusJSON.cut}/>,
        align: 'center'
    },
    {
        field: "cl",
        title: 'C/L',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="C/L" status={row.StatusJSON.cl}/>,
        align: 'center'
    },
    {
        field: "mold",
        title: 'Mold',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="Mold" status={row.StatusJSON.mold}/>,
        align: 'center'
    },
    {
        field: "prd",
        title: 'Prd',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="Prd" status={row.StatusJSON.prd}/>,
        align: 'center'
    },
    {
        field: "card",
        title: 'Card',
        sortable: true,
        render: (row) => <WorkTicketStatusBadge text="Card" status={row.StatusJSON.card}/>,
        align: 'center'
    },
    {
        field: "QuantityOrdered",
        title: 'Ordered',
        sortable: true,
        render: (row) => numeral(row.QuantityOrdered).format('0,0'),
        align: 'end'
    },
    {
        field: "QuantityCompleted",
        title: 'Complete',
        sortable: true,
        render: (row) => numeral(row.QuantityCompleted).format('0,0'),
        align: 'end'
    },
]
