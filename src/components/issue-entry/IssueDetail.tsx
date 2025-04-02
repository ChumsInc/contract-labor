import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueDetail,
    selectCurrentIssueHeader,
    setIssueDetailQuantityIssued,
    toggleIssueDetailSelected
} from "@/ducks/issue-entry/issueEntrySlice";
import {isCLIssue, issueDetailKey} from "@/utils/issue";
import numeral from "numeral";
import Decimal from "decimal.js";
import dayjs from "dayjs";
import {CLIssueEntryDetail} from "../../types";
import IssueQuantityInput from "@/components/issue-entry/IssueQuantityInput";
import {issueDetailTotal} from "@/ducks/issue-entry/utils";


const IssueDetail = () => {
    const dispatch = useAppDispatch();
    const header = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);
    const isReceived = isCLIssue(header) && dayjs(header.DateReceived).isValid();
    const id = useId();
    const [total, setTotal] = useState(issueDetailTotal(detail));

    useEffect(() => {
        setTotal(issueDetailTotal(detail));
    }, [detail]);


    const changeHandler = (field: keyof CLIssueEntryDetail, id?: number, stepNo?: string | null) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'selected':
                dispatch(toggleIssueDetailSelected({id, StepNo: stepNo ?? null, selected: ev.target.checked}));
                return;
            case 'QuantityIssued':
                dispatch(setIssueDetailQuantityIssued({
                    id,
                    StepNo: stepNo ?? null,
                    QuantityIssued: ev.target.valueAsNumber ?? 0
                }));
                return;
        }
    }

    return (
        <table className="table table-xs">
            <thead>
            <tr>
                <th>&nbsp;</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Quantity</th>
                <th className="text-end">Rate</th>
                <th className="text-end">Cost</th>
            </tr>
            </thead>
            <tbody>
            {detail.map(row => (
                <tr key={issueDetailKey(row)}>
                    <td>
                        <input type="checkbox" checked={row.selected} className="form-check-input"
                               id={`${id}-${issueDetailKey(row)}`}
                               onChange={changeHandler('selected', row.id, row.StepNo)}
                               readOnly={isReceived}/>
                    </td>
                    <td>
                        <label htmlFor={`${id}-${issueDetailKey(row)}`}>{row.WorkCenter}/{row.ActivityCode}</label>
                    </td>
                    <td>{row.StepDescription}</td>
                    <td>
                        <IssueQuantityInput quantityIssued={row.QuantityIssued ?? 0}
                                            onChange={changeHandler('QuantityIssued', row.id, row.StepNo)}
                                            disabled={!row.selected} readOnly={!row.selected}/>
                    </td>
                    <td className="text-end">{numeral(row.ActivityRate).format('0.000')}</td>
                    <td className="text-end">
                        {row.selected
                            ? numeral(new Decimal(row.ActivityRate ?? 0).times(row.QuantityIssued).div(row.ScalingFactor ?? 1).toString()).format('0,0.00')
                            : '-'
                        }
                    </td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <th></th>
                <th colSpan={4}>Total</th>
                <td className="text-end">{numeral(total).format('0,0.00')}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default IssueDetail;
