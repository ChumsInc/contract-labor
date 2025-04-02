import React, {ChangeEvent, InputHTMLAttributes, useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import classNames from "classnames";
import {selectCurrentIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import {selectWorkTicketHeader} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {friendlyDate} from "@/utils/dates";
import {WorkTicketHeader} from "../../types";
import {isFulfilled} from "@reduxjs/toolkit";
import Alert from "react-bootstrap/Alert";
import {useDebounceValue} from "usehooks-ts";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


const makeForText = (wt: WorkTicketHeader) => {
    switch (wt.WorkTicketType) {
        case 'A':
            return `W/T ${wt.MakeForWorkTicketNo}`;
        case 'S':
            return `S/O ${wt.MakeForSalesOrderNo}`;
        case 'I':
        default:
            return 'Inventory';
    }
}

export interface IssueWorkTicketProps {
    inputProps?: FormControlProps;
    ref?: React.ForwardedRef<HTMLInputElement>;
    containerClassName?: string;
}


export default function IssueWorkTicket({inputProps, ref, containerClassName}: IssueWorkTicketProps) {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const workTicket = useAppSelector(selectWorkTicketHeader);
    const id = useId();
    const dueId = useId();
    const makeForId = useId();



    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentEntry({WorkTicketNo: ev.target.value}));
    }

    const loadWorkTicketHandler = async () => {
        dispatch(setCurrentWorkTicket(current.WorkTicketNo.trim().padStart(12, '0')));
    }

    const show = workTicket?.WorkTicketNo === current.WorkTicketNo;

    return (
        <div>
            <div className="mb-1">
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={id}>Work Ticket #</InputGroup.Text>
                    <FormControl size="sm" type="search" {...inputProps} id={id}
                           defaultValue={current.WorkTicketNo ?? ''}
                           onChange={changeHandler}/>
                    <Button type="button" size="sm" variant="secondary"
                            onClick={loadWorkTicketHandler}>
                        <span className="bi-search" aria-label="Load work ticket"/>
                    </Button>
                </InputGroup>
            </div>
            <div className={classNames('collapse', {show: show, 'mb-1': show})}>
                <Row className="g-3">
                    {show && workTicket?.WorkTicketStatus === 'C' && (
                        <Col xs={12}>
                            <Alert variant="danger">
                                Closed Work Ticket
                            </Alert>
                        </Col>
                    )}
                    {show && workTicket?.WorkTicketStatus === 'X' && (
                        <Col xs={12} className="text-danger">
                            <span className="bi-exclamation-triangle-fill me-3"/> Cancelled Work Ticket
                        </Col>
                    )}
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Text as="label" htmlFor={dueId}>Prod. Due</InputGroup.Text>
                            <FormControl type="text" size="sm" id={dueId}
                                   value={workTicket?.ProductionDueDate ? friendlyDate(workTicket.ProductionDueDate) ?? '' : ''}
                                   readOnly disabled/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="input-group input-group-sm">
                            <InputGroup.Text as="label" htmlFor={makeForId}>Make For</InputGroup.Text>
                            <FormControl type="text" size="sm" id={makeForId}
                                   value={workTicket ? makeForText(workTicket) : ''} readOnly disabled/>
                        </InputGroup>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
