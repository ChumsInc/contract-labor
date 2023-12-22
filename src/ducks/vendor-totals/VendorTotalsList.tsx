import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectSortedVendorTotals, selectVendorTotalsSort} from "./selectors";
import {SortableTable, SortableTableField, SortProps} from "chums-components";
import {VendorWeekTotal} from "../../types";
import {loadVendorTotals, setVendorTotalsSort} from "./actions";
import numeral from "numeral";
import {setCurrentIssueVendorNo} from "../issue/actions";
import {selectIssueCurrentVendorNo} from "../issue/selectors";

const fields: SortableTableField<VendorWeekTotal>[] = [
    {field: 'VendorNo', title: 'Vendor No.', sortable: true},
    {
        field: 'VendorNameOverride',
        title: 'Name',
        sortable: true,
        render: (row) => row.VendorNameOverride || row.VendorName
    },
    {
        field: 'QuantityDueToday',
        title: 'Due Today',
        sortable: true,
        render: (row) => numeral(row.QuantityDueToday).format('0,0'),
        className: 'text-end'
    },
    {
        field: 'QuantityIssued',
        title: '# Today',
        sortable: true,
        render: (row) => numeral(row.QuantityIssued).format('0,0'),
        className: 'text-end'
    },
    {field: 'CostIssued', title: '$ Today', sortable: true, render: (row) => numeral(row.CostIssued).format('$0,0.00'),
        className: 'text-end'},
    {
        field: 'QuantityIssuedWeek',
        title: '# This Week',
        sortable: true,
        render: (row) => numeral(row.QuantityIssuedWeek).format('0,0'),
        className: 'text-end'
    },
    {
        field: 'CostIssuedWeek',
        title: '$ This Week',
        sortable: true,
        render: (row) => numeral(row.CostIssuedWeek).format('$0,0.00'),
        className: 'text-end'
    },
    {
        field: 'QuantityDueThisWeek',
        title: 'Due This Week',
        sortable: true,
        render: (row) => numeral(row.QuantityDueThisWeek).format('0,0'),
        className: 'text-end'
    },
    {
        field: 'QuantityDueFuture',
        title: 'Due Future',
        sortable: true,
        render: (row) => numeral(row.QuantityDueFuture).format('0,0'),
        className: 'text-end'
    },
]
const VendorTotalsList = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedVendorTotals);
    const sort = useAppSelector(selectVendorTotalsSort);
    const currentVendorNo = useAppSelector(selectIssueCurrentVendorNo);

    useEffect(() => {
        dispatch(loadVendorTotals(new Date().toISOString()));
    }, []);

    const sortChangeHandler = (sort: SortProps<VendorWeekTotal>) => {
        dispatch(setVendorTotalsSort(sort));
    }

    return (
        <div>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           data={list}
                           selected={(row) => row.VendorNo === currentVendorNo}
                           onSelectRow={(row) => dispatch(setCurrentIssueVendorNo(row.VendorNo))}
                           size="sm"
                           keyField="VendorNo"/>

        </div>
    )
}

export default VendorTotalsList;
