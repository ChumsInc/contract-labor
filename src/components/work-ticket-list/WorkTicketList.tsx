import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectSortedWTList, selectWTListSort, setWTListSort} from "@/ducks/work-ticket/workTicketListSlice";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import {WorkTicketSortProps, WorkTicketTableRow} from "@/ducks/work-ticket/types";
import {fields} from "@/components/work-ticket-list/WorkTicketListFields";
import WorkTicketListActionBar from "@/components/work-ticket-list/WorkTicketListActionBar";
import {selectWorkTicketNo} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {WorkTicketWorkStatusItem} from "chums-types";

const WorkTicketTable = SortableTable<WorkTicketTableRow>

export default function WorkTicketList() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedWTList);
    const sort = useAppSelector(selectWTListSort);
    const workTicketNo = useAppSelector(selectWorkTicketNo)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setPage(0);
    }, [list.length, rowsPerPage]);

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
