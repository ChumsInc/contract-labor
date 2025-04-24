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
import dayjs from "dayjs";
import {CLIssueEntryDetail} from "chums-types";
import IssueQuantityInput from "@/components/issue-entry/IssueQuantityInput";
import {activityIssueCost, calcCostIssued} from "@/ducks/issue-entry/utils";


function IssueDetailRow({row, id, onChangeSelected, onChange, isReceived}: {
    row: CLIssueEntryDetail;
    id: string | number;
    onChangeSelected: (ev: ChangeEvent<HTMLInputElement>) => void;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    isReceived: boolean;
}) {
    return (
        <tr key={issueDetailKey(row)}>
            <td>
                <input type="checkbox" checked={row.selected} className="form-check-input"
                       id={`${id}-${issueDetailKey(row)}`}
                       onChange={onChangeSelected}
                       readOnly={isReceived}/>
            </td>
            <td>
                <label htmlFor={`${id}-${issueDetailKey(row)}`}>{row.WorkCenter}/{row.ActivityCode}</label>
            </td>
            <td>{row.StepDescription}</td>
            <td>
                <IssueQuantityInput quantity={row.QuantityIssued ?? 0}
                                    onChange={onChange}
                                    disabled={!row.selected} readOnly={!row.selected}/>
            </td>
            <td className="text-end">{numeral(row.ActivityRate).format('0.000')}</td>
            <td className="text-end">
                {row.selected
                    ? numeral(activityIssueCost(row)).format('0,0.00')
                    : '-'
                }
            </td>
        </tr>
    )
}

const IssueDetail = () => {
    const dispatch = useAppDispatch();
    const header = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail) as CLIssueEntryDetail[];
    const isReceived = isCLIssue(header) && dayjs(header.DateReceived).isValid();
    const id = useId();
    const [total, setTotal] = useState(calcCostIssued(detail));

    useEffect(() => {
        setTotal(calcCostIssued(detail));
    }, [detail]);


    const changeHandler = (field: keyof CLIssueEntryDetail, id: number, stepNo?: string | null) => (ev: ChangeEvent<HTMLInputElement>) => {
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
                <IssueDetailRow key={issueDetailKey(row)} row={row}
                                onChangeSelected={changeHandler('selected', row.id ?? 0, row.StepNo)}
                                onChange={changeHandler('QuantityIssued', row.id ?? 0, row.StepNo)}
                                id={id} isReceived={isReceived}/>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td/>
                <th colSpan={4}>Total</th>
                <td className="text-end">{numeral(total).format('0,0.00')}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default IssueDetail;
