import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueDetail,
    selectCurrentIssueHeader, selectCurrentIssueStatus,
    updateCurrentEntry,
} from "@/ducks/issue-entry/issueEntrySlice";
import VendorSelect from "./VendorSelect";
import IssueId from "./IssueId";
import {CLIssueEntry} from "../../types";
import IssueWorkTicket from "./IssueWorkTicket";
import WorkTicketAssignedAlert from "@/ducks/work-ticket/WorkTicketAssignedAlert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {isCLIssue} from "@/utils/issue";
import IssueDateIssued from "./IssueDateIssued";
import IssueDateDue from "./IssueDateDue";
import IssueQuantityIssued from "./IssueQuantityIssued";
import IssueDetail from "./IssueDetail";
import IssueItem from "./IssueItem";
import NewEntryButton from "./NewEntryButton";
import IssueNotes from "./IssueNotes";
import IssueTemplate from "./IssueTemplate";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {removeCLIssueEntry, saveCLIssueEntry} from "@/ducks/issue-entry/actions";
import Button from "react-bootstrap/Button";
import CLIssuePrintButton from "@/components/issue-entry/CLIssuePrintButton";
import {setWorkTicketStatus} from "@/ducks/work-ticket/actions";
import {CLIssueResponse} from "chums-types";
import {PayloadAction} from "@reduxjs/toolkit";
import {ProgressBar} from "react-bootstrap";

dayjs.extend(utc);

const CLIssueForm = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);
    const status = useAppSelector(selectCurrentIssueStatus);


    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        const res = await dispatch(saveCLIssueEntry({...current, detail}));
        const payload:CLIssueResponse|null = res.payload as CLIssueResponse ?? null
        if (!payload || !payload.issue?.WorkTicketKey) {
            return;
        }
        await dispatch(setWorkTicketStatus({WorkTicketKey: payload.issue.WorkTicketKey, action: 'cl', nextStatus: 1}))
    }

    const deleteHandler = async () => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            await dispatch(removeCLIssueEntry(current))
            if (isCLIssue(current) && current.WorkTicketKey) {
                await dispatch(setWorkTicketStatus({WorkTicketKey: current.WorkTicketKey, action: 'cl', nextStatus: 0}))
            }
        }
    }

    const changeHandler = (field: keyof CLIssueEntry) => (ev: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        switch (field) {
            case 'DateDue':
            case 'DateIssued':
                const dateValue = dayjs((ev as ChangeEvent<HTMLInputElement>).target.valueAsDate);
                if (dateValue.isValid()) {
                    dispatch(updateCurrentEntry({[field]: dateValue.utcOffset((new Date()).getTimezoneOffset())}));
                }
                return;

            case 'QuantityIssued':
                dispatch(updateCurrentEntry({[field]: (ev as ChangeEvent<HTMLInputElement>).target.valueAsNumber}));
                return;

            default:
                dispatch(updateCurrentEntry({[field]: ev.target.value}));
                return;
        }
    }


    return (
        <form onSubmit={submitHandler}>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueId/>
                        </Col>
                        <Col xs={12} md={6}>
                            <VendorSelect required value={current.VendorNo ?? ''} onChange={changeHandler('VendorNo')}/>
                        </Col>
                    </Row>
                    <IssueWorkTicket containerClassName="mb-1" showDueDate showMakeFor/>
                    <WorkTicketAssignedAlert/>
                    <IssueTemplate/>
                    <IssueItem/>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueDateIssued required/>
                        </Col>
                        <Col xs={12} md={6}>
                            <IssueQuantityIssued required/>
                        </Col>
                    </Row>
                    <div className="mb-1">
                        <IssueDateDue required/>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <IssueDetail/>
                </Col>

            </Row>
            <div className="mb-1">
                <IssueNotes/>
            </div>
            <Row className="row g-3 mb-1 justify-content-end">
                <Col xs={12} lg="auto">
                    {status !== 'idle' && <ProgressBar striped animated now={100}/>}
                </Col>
                <Col xs="auto">
                    <NewEntryButton/>
                </Col>
                <Col xs="auto">
                    <button type="button" className="btn btn-sm btn-outline-danger"
                            onClick={deleteHandler}
                            disabled={!isCLIssue(current) || (isCLIssue(current) && dayjs(current.DateReceived).isValid())}>
                        Delete
                    </button>
                </Col>
                <Col xs="auto">
                    <CLIssuePrintButton />
                </Col>
                <Col xs="auto">
                    <button type="submit" className="btn btn-sm btn-primary"
                            disabled={!current.VendorNo || !current.QuantityIssued}>
                        Issue Work
                    </button>
                </Col>
            </Row>
        </form>

    )
}

export default CLIssueForm;
