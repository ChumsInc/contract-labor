import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectHistoryLoading, selectSort, selectSortedHistory, setSort} from "@/ducks/issue-history";
import {ProgressBar} from "react-bootstrap";
import {LocalStore} from "@chumsinc/ui-utils";
import {historyRowsPerPage} from "@/utils/storageKeys";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import {CLIssue, SortProps} from "chums-types";
import {fields} from "./historyListFields";
import classNames from "classnames";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import numeral from "numeral";


const rowClassName = (row: CLIssue): string => {
    const today = new Date();
    return classNames({
        'table-danger': !row.DateReceived && dayjs(row.DateDue).isBefore(today, 'day'),
        'table-success': !!row.DateReceived,
        'table-info': dayjs(row.DateIssued).isAfter(today, 'day')
    })
}

export interface IssueHistoryTotal {
    quantityIssued: number|string|Decimal;
    costIssued: number|string|Decimal;
    quantityDue: number|string|Decimal;
    quantityReceived: number|string|Decimal;
    quantityRepaired: number|string|Decimal;
    costReceived: number|string|Decimal;
}
const emptyTotal:IssueHistoryTotal = {
    quantityIssued: 0,
    costIssued: 0,
    quantityDue: 0,
    quantityReceived: 0,
    quantityRepaired: 0,
    costReceived: 0,
}

function buildTotals(list:CLIssue[]):IssueHistoryTotal {
    return list.reduce((pv, cv) => {
        return {
            quantityIssued: new Decimal(pv.quantityIssued).add(cv.QuantityIssued),
            costIssued: new Decimal(pv.costIssued).add(cv.CostIssued),
            quantityDue: new Decimal(pv.quantityDue).add(cv.DateReceived ? 0 : cv.QuantityIssued),
            quantityReceived: new Decimal(pv.quantityReceived).add(cv.QuantityReceived),
            quantityRepaired: new Decimal(pv.quantityRepaired).add(cv.QuantityRepaired),
            costReceived: new Decimal(pv.costReceived).add(cv.CostReceived)
        }
    }, {...emptyTotal})
}

export default function IssueHistoryList() {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectHistoryLoading);
    const list = useAppSelector(selectSortedHistory);
    const sort = useAppSelector(selectSort);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [totals, setTotals] = useState<IssueHistoryTotal>(buildTotals(list))

    useEffect(() => {
        setTotals(buildTotals(list));
    }, [list]);

    const rppChangeHandler = (rpp:number) => {
        LocalStore.setItem(historyRowsPerPage, rpp);
        setRowsPerPage(rpp);
    }

    const sortChangeHandler = (sort:SortProps<CLIssue>) => {
        dispatch(setSort(sort))
    }



    return (
        <div>
            {loading && <ProgressBar animated striped now={100}/>}
            <SortableTable<CLIssue> fields={fields} className="table-sticky"
                                    currentSort={sort} onChangeSort={sortChangeHandler}
                                    data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                    keyField="id"
                                    rowClassName={rowClassName}
                                    size="sm"
                                    tfoot={
                <tfoot>
                <tr>
                    <td colSpan={15}>...</td>
                </tr>
                <tr>
                    <th colSpan={7} scope="row">Total <span className="ms-3">({numeral(list.length).format('0,0')})</span> </th>
                    <td className="text-end">{numeral(totals.quantityIssued).format('0,0')}</td>
                    <td className="text-end">{numeral(totals.costIssued).format('0,0.00')}</td>
                    <td colSpan={2} className="text-end">
                        {numeral(totals.quantityDue).format('0,0')}
                    </td>
                    <td colSpan={2} className="text-end">
                        {numeral(totals.quantityReceived).format('0,0')}
                    </td>
                    <td className="text-end">
                        {numeral(totals.quantityRepaired).format('0,0')}
                    </td>
                    <td className="text-end">
                        {numeral(totals.costReceived).format('0,0.00')}
                    </td>
                </tr>
                </tfoot>
                                    } />

            <TablePagination count={list.length} size="sm"
                             page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rppChangeHandler}}
                             showFirst showLast
            />
        </div>
    )
}
