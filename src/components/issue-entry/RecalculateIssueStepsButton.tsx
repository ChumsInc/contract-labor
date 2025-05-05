import React from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectWorkTicketHeader, selectWorkTicketSteps} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {recalculateIssueDetail, selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";
import {isCLIssue} from "@/utils/issue";
import Alert from "react-bootstrap/Alert";

export default function RecalculateIssueStepsButton() {
    const dispatch = useAppDispatch();
    const issue = useAppSelector(selectCurrentIssueHeader);
    const wt = useAppSelector(selectWorkTicketHeader);
    const steps = useAppSelector(selectWorkTicketSteps);

    const clickHandler = () => {
        dispatch(recalculateIssueDetail(steps));
    }

    if (!isCLIssue(issue)) {
        return null;
    }

    if (wt?.WorkTicketStatus === 'C') {
        return (
           <Alert variant="warning">Work Ticket #{wt.WorkTicketNo.replace(/^0+/, '')} is closed.</Alert>
        )
    }

    return (
        <>
            <Button type="button" size="sm" variant="outline-warning"
                    onClick={clickHandler}
                    disabled={!!issue.DateReceived || !steps.length}>
                Recalculate Issue Steps ({steps.length})
            </Button>
        </>
    )
}
