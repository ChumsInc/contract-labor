import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueDetail,
    selectCurrentIssueHeader,
    setIssueDetailQuantityReceived,
    updateCurrentEntry
} from "@/ducks/issue-entry/issueEntrySlice";
import {issueDetailKey} from "@/utils/issue";
import numeral from "numeral";
import {CLIssue, CLIssueDetail} from "chums-types";
import IssueQuantityInput from "@/components/issue-entry/IssueQuantityInput";
import {activityReceiptCost, calcCostReceived} from "@/ducks/issue-entry/utils";
import Decimal from "decimal.js";

function ReceiptDetailRow({row, id, onChange}: {
    row: CLIssueDetail;
    id: string;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <tr>
            <td>
                <label htmlFor={`${id}-${issueDetailKey(row)}`}>{row.WorkCenter}/{row.ActivityCode}</label>
            </td>
            <td>{row.StepDescription}</td>
            <td>
                <IssueQuantityInput quantity={row.QuantityReceived ?? 0} aria-label="Quantity Received"
                                    onChange={onChange}
                                    id={`${id}-${issueDetailKey(row)}`}/>
            </td>
            <td className="text-end">{numeral(row.ActivityRate).format('0.000')}</td>
            <td className="text-end">
                {numeral(activityReceiptCost(row)).format('0,0.00')}
            </td>
        </tr>
    )
}


const ReceiptDetail = () => {
    const dispatch = useAppDispatch();
    const header = useAppSelector(selectCurrentIssueHeader) as CLIssue;
    const detail = useAppSelector(selectCurrentIssueDetail) as CLIssueDetail[];
    const id = useId();
    const [total, setTotal] = useState(calcCostReceived(detail, header.QuantityRepaired ?? 0));

    useEffect(() => {
        setTotal(calcCostReceived(detail, header.QuantityRepaired ?? 0));
    }, [detail, header.QuantityRepaired]);


    const headerChangeHandler = (field: keyof CLIssue) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentEntry({[field]: ev.target.value || '0'}));
    }

    const changeHandler = (field: keyof CLIssueDetail, id: number, stepNo?: string | null) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'QuantityReceived':
                dispatch(setIssueDetailQuantityReceived({
                    id,
                    StepNo: stepNo ?? null,
                    QuantityReceived: ev.target.valueAsNumber ?? 0
                }));
                return;
        }
    }


    return (
        <table className="table table-xs">
            <thead>
            <tr>
                <th>Activity</th>
                <th>Description</th>
                <th>Quantity</th>
                <th className="text-end">Rate</th>
                <th className="text-end">Cost</th>
            </tr>
            </thead>
            <tbody>
            {detail
                .map(row => (
                    <ReceiptDetailRow key={issueDetailKey(row)} row={row}
                                      onChange={changeHandler('QuantityReceived', row.id, row.StepNo)} id={id}/>
                ))}
            </tbody>
            <tfoot>
            <tr>
                <th colSpan={2}>Fixes</th>
                <td>
                    <IssueQuantityInput quantity={header.QuantityRepaired || ''}
                                        onChange={headerChangeHandler('QuantityRepaired')}/>
                </td>
                <td className="text-end">0.020</td>
                <td className="text-end">{numeral(new Decimal(header.QuantityRepaired ?? 0).times(0.02)).format('0,0.00')}</td>
            </tr>

            <tr>
                <th colSpan={4}>Total</th>
                <td className="text-end">{numeral(total).format('0,0.00')}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default ReceiptDetail
