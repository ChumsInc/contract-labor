import React from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectWorkTicketSteps} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {recalculateIssueDetail} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";

export default function RecalculateIssueStepsButton() {
    const dispatch = useAppDispatch();
    const steps = useAppSelector(selectWorkTicketSteps);

    const clickHandler = () => {
        dispatch(recalculateIssueDetail(steps));
    }
    return (
        <Button type="button" size="sm" variant="outline-warning" onClick={clickHandler}>Recalculate Issue Steps</Button>
    )
}
