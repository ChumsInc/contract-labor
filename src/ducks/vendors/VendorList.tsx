import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectShowInactive, selectSortedVendorList, selectVendorsLoading, selectVendorSort} from "./selectors";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "@chumsinc/sortable-tables";
import {Vendor} from "../../types";
import {loadVendors, setCurrentVendor, setVendorsSort} from "./actions";
import ShowInactiveVendors from "./ShowInactiveVendors";
import classNames from "classnames";
import {LinearProgress} from "@mui/material";
import FormCheck from "react-bootstrap/FormCheck";

const fields: SortableTableField<Vendor>[] = [
    {field: 'VendorNo', title: 'Vendor No', sortable: true},
    {field: 'VendorNameOverride', title: 'Name', sortable: true, render: (row) => row.VendorNameOverride ?? row.VendorName},
    {
        field: 'active',
        title: 'Active',
        render: (row) => <FormCheck type="checkbox" checked={row.active} disabled label=""/>
    },
    {
        field: 'EmailAddress',
        title: 'Email',
        sortable: true,
        render: (row) => !!row.EmailAddress ?
            <a href={`mailto:${row.EmailAddress}`} target="_blank">{row.EmailAddress}</a> : null
    }
]

const VendorList = () => {
    const dispatch = useAppDispatch();
    const vendors = useAppSelector(selectSortedVendorList);
    const sort = useAppSelector(selectVendorSort);
    const showInactive = useAppSelector(selectShowInactive);
    const loading = useAppSelector(selectVendorsLoading);
    const rowsPerPage = 10;
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [vendors, sort, showInactive]);

    const sortChangeHandler = (sort: SortProps<Vendor>) => dispatch(setVendorsSort(sort));
    const reloadHandler = () => dispatch(loadVendors());
    const selectHandler = (vendor:Vendor) => {
        dispatch(setCurrentVendor(vendor));
    }

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <ShowInactiveVendors/>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-outline-primary" onClick={reloadHandler}>Reload</button>
                </div>
            </div>
            {loading && <LinearProgress variant="indeterminate"/>}
            <SortableTable<Vendor> currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           rowClassName={row => classNames({'table-warning': !row.active || row.VendorStatus === 'I'})}
                           onSelectRow={selectHandler}
                           data={vendors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} keyField="id"/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={vendors.length}
                             showFirst={vendors.length > rowsPerPage} showLast={vendors.length > rowsPerPage}/>
        </div>
    )
}

export default VendorList;
