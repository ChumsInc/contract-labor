import React from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectWorkTicketSteps} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {recalculateIssueDetail, selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";
import {isCLIssue} from "@/utils/issue";

export default function RecalculateIssueStepsButton() {
    const dispatch = useAppDispatch();
    const issue = useAppSelector(selectCurrentIssueHeader);
    const steps = useAppSelector(selectWorkTicketSteps);

    const clickHandler = () => {
        dispatch(recalculateIssueDetail(steps));
    }

    if (!isCLIssue(issue) || !steps.length) {
        return null;
    }

    return (
        <Button type="button" size="sm" variant="outline-warning"
                onClick={clickHandler}
                disabled={!!issue.DateReceived}>
            Recalculate Issue Steps
        </Button>
    )
}
