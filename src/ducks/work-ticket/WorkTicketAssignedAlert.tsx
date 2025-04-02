import React, {useEffect, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectWorkTicketHeader, selectWorkTicketStatus} from "./currentWorkTicketSlice";
import dayjs from "dayjs";
import {CLIssue, WorkTicketHeader} from "../../types";
import Decimal from "decimal.js";
import numeral from "numeral";
import {Snackbar, SnackbarContent} from "@mui/material";
import Alert from "@mui/material/Alert";
import {selectOtherIssues} from "@/ducks/work-ticket/workTicketIssuesSlice";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";

const QuantityOrdered = ({wt}: { wt: WorkTicketHeader | null }) => {
    if (!wt) {
        return null;
    }
    return (
        <span>/{numeral(new Decimal(wt.QuantityOrdered).toNumber()).format('0,0')}</span>
    )
}

const WorkTicketMessage = ({issues, wt, handleClose}: {
    issues: CLIssue[],
    wt: WorkTicketHeader | null,
    handleClose: () => void
}) => {
    if (!wt || !issues.length) {
        return null;
    }
    return (
        <Alert severity="warning" onClose={handleClose}>
            <strong>Work Ticket {wt?.WorkTicketNo?.replace(/^0+/, '')} already entered</strong>
            <ul>
                {issues.map(iss => (
                    <li key={iss.id}>{iss.id} {iss.VendorNo}; Qty: {numeral(iss.QuantityIssued).format('0,0')}
                        <QuantityOrdered wt={wt}/>; {dayjs(iss.DateIssued).format('MM/DD/YYYY')}
                    </li>
                ))}
            </ul>
        </Alert>
    )
}

const WorkTicketAssignedAlert = () => {
    const issue = useAppSelector(selectCurrentIssueHeader);
    const issues = useAppSelector(selectOtherIssues);
    const workTicket = useAppSelector(selectWorkTicketHeader);
    const loading = useAppSelector(selectWorkTicketStatus);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(issue.id === 0 && issue.WorkTicketNo !== '' && issues.length > 0);
    }, [issues]);

    return (
        <Snackbar open={open} onClose={() => setOpen(false)}>
            <SnackbarContent message={
                <WorkTicketMessage issues={issues} wt={workTicket} handleClose={() => setOpen(false)}/>
            }/>
        </Snackbar>
    )
}
export default WorkTicketAssignedAlert;
