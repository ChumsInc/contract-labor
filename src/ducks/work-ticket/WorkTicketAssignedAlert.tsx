import React, {useEffect, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectWorkTicketHeader, selectWorkTicketStatus} from "./currentWorkTicketSlice";
import dayjs from "dayjs";
import {CLIssue, WorkTicketHeader} from "../../types";
import Decimal from "decimal.js";
import numeral from "numeral";
import Alert from "react-bootstrap/Alert";
import {selectOtherIssues} from "@/ducks/work-ticket/workTicketIssuesSlice";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import {Toast, ToastContainer} from "react-bootstrap";

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
        <Alert variant="warning" dismissible onClose={handleClose}>
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
        <ToastContainer position="top-center">
            <Toast show={open} onClose={() => setOpen(false)} bg="warning">
                <Toast.Header>
                    Work Ticket {workTicket?.WorkTicketNo?.replace(/^0+/, '')} already entered
                </Toast.Header>
                <Toast.Body>
                    <ul>
                        {issues.map(iss => (
                            <li key={iss.id}>{iss.id} {iss.VendorNo}; Qty: {numeral(iss.QuantityIssued).format('0,0')}
                                <QuantityOrdered wt={workTicket}/>; {dayjs(iss.DateIssued).format('MM/DD/YYYY')}
                            </li>
                        ))}
                    </ul>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
export default WorkTicketAssignedAlert;
