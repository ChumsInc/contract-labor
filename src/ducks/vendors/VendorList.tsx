import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectShowInactive, selectSortedVendorList, selectVendorsLoading, selectVendorSort} from "./selectors";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "@chumsinc/sortable-tables";
import {loadVendors, setCurrentVendor, setVendorsSort} from "./actions";
import ShowInactiveVendors from "./ShowInactiveVendors";
import classNames from "classnames";
import FormCheck from "react-bootstrap/FormCheck";
import {Spinner} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {CLVendor} from "chums-types";

const fields: SortableTableField<CLVendor>[] = [
    {field: 'VendorNo', title: 'Vendor No', sortable: true},
    {
        field: 'VendorNameOverride',
        title: 'Name',
        sortable: true,
        render: (row) => row.VendorNameOverride ?? row.VendorName
    },
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

    const sortChangeHandler = (sort: SortProps<CLVendor>) => dispatch(setVendorsSort(sort));
    const reloadHandler = () => dispatch(loadVendors());
    const selectHandler = (vendor: CLVendor) => {
        dispatch(setCurrentVendor(vendor));
    }

    return (
        <div>
            <Row className="g-3 align-items-baseline">
                <Col xs="auto">
                    <ShowInactiveVendors/>
                </Col>
                <Col xs="auto">
                    <Button size="sm" variant="outline-primary" onClick={reloadHandler}>Reload</Button>
                </Col>
                <Col xs="auto">
                    {loading && (<Spinner size="sm" variant="primary"/>)}
                </Col>
            </Row>

            <SortableTable<CLVendor> currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                                     rowClassName={row => classNames({'table-warning': !row.active || row.VendorStatus === 'I'})}
                                     onSelectRow={selectHandler}
                                     data={vendors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                     keyField="id"/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={vendors.length}
                             showFirst={vendors.length > rowsPerPage} showLast={vendors.length > rowsPerPage}/>
        </div>
    )
}

export default VendorList;
