import React, {useEffect, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectWorkTicketHeader} from "./currentWorkTicketSlice";
import dayjs from "dayjs";
import {CLIssue, WorkTicketHeader} from "../../types";
import Decimal from "decimal.js";
import numeral from "numeral";
import Alert from "react-bootstrap/Alert";
import {selectOtherIssues} from "@/ducks/work-ticket/workTicketIssuesSlice";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import {Offcanvas} from "react-bootstrap";

const QuantityOrdered = ({wt}: { wt: WorkTicketHeader | null }) => {
    if (!wt) {
        return null;
    }
    return (
        <span>/{numeral(new Decimal(wt.QuantityOrdered).toNumber()).format('0,0')}</span>
    )
}


const WorkTicketAssignedAlert = () => {
    const issue = useAppSelector(selectCurrentIssueHeader);
    const issues = useAppSelector(selectOtherIssues);
    const workTicket = useAppSelector(selectWorkTicketHeader);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(issue.id === 0 && issue.WorkTicketNo !== '' && issues.length > 0);
    }, [issues]);

    return (
        <Offcanvas placement="bottom" show={open}>
            <Alert variant="warning" className="text-dark" dismissible onClose={() => setOpen(false)}>
                <Alert.Heading>
                    Work Ticket {workTicket?.WorkTicketNo?.replace(/^0+/, '')}
                    {' '} is already entered.
                </Alert.Heading>
                <ul>
                    {issues.map(iss => (
                        <li key={iss.id}>
                            {iss.id} {iss.VendorNo}; Qty: {numeral(iss.QuantityIssued).format('0,0')}
                            <QuantityOrdered wt={workTicket}/>; {dayjs(iss.DateIssued).format('MM/DD/YYYY')}
                        </li>
                    ))}
                </ul>
            </Alert>
        </Offcanvas>
    )
}
export default WorkTicketAssignedAlert;
