import React from 'react';
import {VendorWeekTotal} from "@/src/types";
import classNames from "classnames";
import numeral from "numeral";
import {Table} from "react-bootstrap";

export default function VendorTotalTable({totals}:{totals:VendorWeekTotal}) {
    return (
        <Table className="table-xs" style={{marginBottom: 0}}>
            <thead>
            <tr>
                <th></th>
                <th className="text-end">Today</th>
                <th className="text-end">This Week</th>
                <th className="text-end">Future</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">Issued</th>
                <td className={classNames("text-end", {'text-secondary': +totals.CostIssued === 0})}>{numeral(totals.CostIssued).format('$0,0.00')}</td>
                <td className={classNames("text-end", {'text-secondary': +totals.CostIssuedWeek === 0})}>{numeral(totals.CostIssuedWeek).format('$0,0.00')}</td>
                <td className="text-end text-secondary">N/A</td>
            </tr>
            <tr>
                <th>Due</th>
                <td className={classNames("text-end", {'text-secondary': +totals.CostDueToday === 0})}>{numeral(totals.CostDueToday).format('$0,0.00')}</td>
                <td className={classNames("text-end", {'text-secondary': +totals.CostDueThisWeek === 0})}>{numeral(totals.CostDueThisWeek).format('$0,0.00')}</td>
                <td className={classNames("text-end", {'text-secondary': +totals.CostDueFuture === 0})}>{numeral(totals.CostDueFuture).format('$0,0.00')}</td>
            </tr>
            </tbody>
        </Table>
    )
}
