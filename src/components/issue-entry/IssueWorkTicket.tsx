import React, {ChangeEvent, useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import classNames from "classnames";
import {selectCurrentIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {setCurrentWorkTicket} from "@/ducks/work-ticket/actions";
import {selectWorkTicketHeader} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {friendlyDate} from "@/utils/dates";
import {WorkTicketHeader} from "chums-types";
import Alert from "react-bootstrap/Alert";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Collapse} from "react-bootstrap";


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
    showDueDate?: boolean;
    showMakeFor?: boolean;
}


export default function IssueWorkTicket({inputProps, showDueDate, showMakeFor}: IssueWorkTicketProps) {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const workTicket = useAppSelector(selectWorkTicketHeader);
    const id = useId();
    const dueId = useId();
    const makeForId = useId();
    const [show, setShow] = React.useState(workTicket?.WorkTicketNo?.replace(/^0+/, '') === current.WorkTicketNo);


    useEffect(() => {
        setShow(workTicket?.WorkTicketNo?.replace(/^0+/, '') === current.WorkTicketNo);
    }, [workTicket, current]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentEntry({WorkTicketNo: ev.target.value}));
    }

    const loadWorkTicketHandler = async () => {
        dispatch(setCurrentWorkTicket(current.WorkTicketNo?.trim()?.padStart(12, '0') ?? ''));
    }

    return (
        <div>
            <div className="mb-1">
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={id}>Work Ticket #</InputGroup.Text>
                    <FormControl size="sm" type="search" {...inputProps} id={id}
                                 value={current.WorkTicketNo ?? ''}
                                 onChange={changeHandler}/>
                    <Button type="button" size="sm" variant="secondary"
                            onClick={loadWorkTicketHandler}>
                        <span className="bi-search" aria-label="Load work ticket"/>
                    </Button>
                </InputGroup>
            </div>
            <Collapse in={show}>
                <div>
                    {workTicket?.WorkTicketStatus === 'C' && (
                        <Alert variant="danger">
                            <span className="bi-lock-fill me-3" aria-hidden />
                            Closed Work Ticket
                        </Alert>
                    )}
                    {workTicket?.WorkTicketStatus === 'X' && (
                        <Alert variant="danger">
                            <span className="bi-exclamation-triangle-fill me-3"/>
                            Cancelled Work Ticket
                        </Alert>
                    )}
                </div>
            </Collapse>
            <Row className={classNames("g-3", {'mb-1': showDueDate || showMakeFor})}>
                {showDueDate && (
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Text as="label" htmlFor={dueId}>Prod. Due</InputGroup.Text>
                            <FormControl type="text" size="sm" id={dueId}
                                         value={workTicket?.ProductionDueDate ? friendlyDate(workTicket.ProductionDueDate) ?? '' : ''}
                                         readOnly disabled/>
                        </InputGroup>
                    </Col>
                )}
                {showMakeFor && (
                    <Col>
                        <InputGroup className="input-group input-group-sm">
                            <InputGroup.Text as="label" htmlFor={makeForId}>Make For</InputGroup.Text>
                            <FormControl type="text" size="sm" id={makeForId}
                                         value={workTicket ? makeForText(workTicket) : ''} readOnly disabled/>
                        </InputGroup>
                    </Col>
                )}
                {!showDueDate && !showMakeFor && (<Col></Col>)}
            </Row>
        </div>
    )
}
