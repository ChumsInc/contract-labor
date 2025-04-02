import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectSortedWTList,
    selectWTListSort,
    selectWTListStatus,
    setWTListSort
} from "@/ducks/work-ticket/workTicketListSlice";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import {WorkTicketWorkStatusItem} from "../../types";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import {WorkTicketSortProps, WorkTicketTableRow} from "@/ducks/work-ticket/types";
import {ProgressBar} from "react-bootstrap";
import {fields} from "@/components/work-ticket-list/WorkTicketListFields";
import WorkTicketListActionBar from "@/components/work-ticket-list/WorkTicketListActionBar";
import {selectWorkTicketNo} from "@/ducks/work-ticket/currentWorkTicketSlice";

const WorkTicketTable = SortableTable<WorkTicketTableRow>

export default function WorkTicketList() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedWTList);
    const status = useAppSelector(selectWTListStatus);
    const sort = useAppSelector(selectWTListSort);
    const workTicketNo = useAppSelector(selectWorkTicketNo)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setPage(0);
    }, [list, rowsPerPage]);

    const sortChangeHandler = (sort: WorkTicketSortProps) => {
        dispatch(setWTListSort(sort))
    }

    const selectRowHandler = (row: WorkTicketWorkStatusItem) => {
        dispatch(setCurrentWorkTicket(row.WorkTicketNo))
    }

    return (
        <div>
            <h3>Open Work Tickets</h3>
            <WorkTicketListActionBar/>
            {status === 'loading' && <ProgressBar striped animated now={100}/>}
            <WorkTicketTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields} size="xs"
                             selected={(wt) => wt.WorkTicketNo === workTicketNo}
                             data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                             onSelectRow={selectRowHandler}
                             keyField="WorkTicketKey"/>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: setRowsPerPage}}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}
