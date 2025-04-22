import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {CLIssue} from "../../types";
import {SortableTable, SortProps, TablePagination} from "@chumsinc/sortable-tables";
import {loadCurrentIssueList} from "@/ducks/issue-list/actions";
import classNames from "classnames";
import dayjs from "dayjs";
import {loadCLIssueEntry} from "@/ducks/issue-entry/actions";
import {fields} from "@/components/issue-list/issueListFields";
import {selectFilteredIssueList, selectSort, setSort} from "@/ducks/issue-list/issueListSlice";
import IssueListFilters from "@/components/issue-list/IssueListFilters";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CLIssueListPrintButton from "@/components/issue-entry/CLIssueListPrintButton";

const rowClassName = (row: CLIssue): string => {
    const today = new Date();
    return classNames({
        'table-danger': !row.DateReceived && dayjs(row.DateDue).isBefore(today, 'day'),
        'table-success': !!row.DateReceived,
        'table-info': dayjs(row.DateIssued).isAfter(today, 'day')
    })
}
export default function CurrentIssueList() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectFilteredIssueList);
    const sort = useAppSelector(selectSort);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    useEffect(() => {
        dispatch(loadCurrentIssueList())
    }, []);


    useEffect(() => {
        setPage(0);
    }, [list.length, sort]);

    const rowsPerPageChangeHandler = (rowsPerPage: number) => {
        setPage(0);
        setRowsPerPage(rowsPerPage);
    }

    const rowSelectHandler = (row: CLIssue) => {
        dispatch(loadCLIssueEntry(row));
        dispatch(setCurrentWorkTicket(row.WorkTicketNo));
    }

    const sortChangeHandler = (sort: SortProps<CLIssue>) => dispatch(setSort(sort));
    return (
        <div>
            <IssueListFilters/>
            <div className="table-responsive">
                <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                               fields={fields}
                               data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                               size="xs"
                               rowClassName={rowClassName} onSelectRow={rowSelectHandler}
                               keyField="id"/>
            </div>
            <Row>
                <Col sm="auto">
                    <CLIssueListPrintButton/>
                </Col>
                <Col>
                    <TablePagination size="sm" page={page} onChangePage={setPage}
                                     rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                                     showFirst showLast
                                     count={list.length}/>
                </Col>
            </Row>
        </div>

    )
}
