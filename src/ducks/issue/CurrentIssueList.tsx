import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectIssueListSort, selectSortedIssueList} from "./selectors";
import {CLIssue} from "../../types";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {loadCurrentIssueList, setCurrentIssueSort} from "./actions";
import {friendlyDate} from "../../utils/dates";
import numeral from "numeral";
import classNames from "classnames";
import dayjs from "dayjs";

const fields:SortableTableField<CLIssue>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'WarehouseCode', title: 'Whs', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'WorkTicketNo', title: 'Work Ticket', sortable: true, render: (row) => row.WorkTicketNo.replace(/^0+/, '')},
    {field: 'ActivityCodes', title: 'Operations', sortable: true},
    {field: 'DateIssued', title: 'Date Issued', sortable: true, render: (row) => friendlyDate(row.DateIssued), className: 'text-end'},
    {field: 'QuantityIssued', title: 'Issued', sortable: true, render: (row) => numeral(row.QuantityIssued).format('0,0'), className: 'text-end'},
    {field: 'CostIssued', title: 'Cost', sortable: true, render: (row) => numeral(row.CostIssued).format('0,0.00'), className: 'text-end'},
    {field: 'DateDue', title: 'Due', sortable: true, render: (row) => friendlyDate(row.DateDue), className: 'text-end'},
    {field: 'DateReceived', title: "Date Rec'd", sortable: true, render: (row) => friendlyDate(row.DateReceived), className: 'text-end'},
    {field: 'QuantityReceived', title: "Received", sortable: true, render: (row) => numeral(row.QuantityReceived).format('0,0'), className: 'text-end'},
    {field: 'QuantityRepaired', title: "Repairs", sortable: true, render: (row) => numeral(row.QuantityRepaired).format('0,0'), className: 'text-end'},
    {field: 'CostReceived', title: "Cost", sortable: true, render: (row) => numeral(row.CostReceived).format('0,0.00'), className: 'text-end'},
]

const filteredFields = (showCosts: boolean) => {
    const hidden:(keyof CLIssue)[] = ['CostIssued', 'CostReceived'];
    return showCosts ? fields : fields.filter(f => !hidden.includes(f.field));
}

const rowClassName = (row:CLIssue):string => {
    const today = new Date();
    return classNames({
        'table-danger': !row.DateReceived && dayjs(row.DateDue).isBefore(today, 'day'),
        'table-success': !!row.DateReceived,
        'table-info': dayjs(row.DateIssued).isAfter(today, 'day')
    })
}
const CurrentIssueList = ({showCosts}:{showCosts: boolean}) => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedIssueList);
    const sort = useAppSelector(selectIssueListSort);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);

    useEffect(() => {
        dispatch(loadCurrentIssueList());
    }, []);

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const rowsPerPageChangeHandler = (rowsPerPage: number) => {
        setPage(0);
        setRowsPerPage(rowsPerPage);
    }

    const sortChangeHandler = (sort:SortProps<CLIssue>) => dispatch(setCurrentIssueSort(sort));
    return (
        <div>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           fields={filteredFields(showCosts)}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           rowClassName={rowClassName}
                           keyField="id" />
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={list.length} />
        </div>

    )
}

export default CurrentIssueList;
