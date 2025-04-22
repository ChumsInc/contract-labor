import React, {FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {Form, ProgressBar, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {selectCurrentIssueHeader, selectCurrentIssueStatus} from "@/ducks/issue-entry/issueEntrySlice";
import IssueId from "@/components/issue-entry/IssueId";
import VendorSelect from "@/components/issue-entry/VendorSelect";
import IssueWorkTicket from "@/components/issue-entry/IssueWorkTicket";
import IssueTemplate from "@/components/issue-entry/IssueTemplate";
import IssueItem from "@/components/issue-entry/IssueItem";
import IssueDateIssued from "@/components/issue-entry/IssueDateIssued";
import IssueQuantityIssued from "@/components/issue-entry/IssueQuantityIssued";
import ReceiptDetail from "@/components/receipt-entry/ReceiptDetail";
import {isCLIssue} from "@/utils/issue";
import IssueDateReceived from "@/components/receipt-entry/IssueDateReceived";
import IssueQuantityReceived from "@/components/receipt-entry/IssueQuantityReceived";
import Button from "react-bootstrap/Button";
import {receiveCLIssue, removeCLReceipt} from "@/ducks/issue-entry/actions";
import dayjs from "dayjs";
import {setWorkTicketStatus} from "@/ducks/work-ticket/actions";
import {CLIssueResponse} from "chums-types";

export default function CLReceiptForm() {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const status = useAppSelector(selectCurrentIssueStatus);

    const submitHandler = async (ev:FormEvent) => {
        ev.preventDefault();
        if (!isCLIssue(current)) {
            return
        }
        const res = await dispatch(receiveCLIssue(dayjs(current.DateReceived ?? new Date()).format('YYYY-MM-DD')));
        const payload:CLIssueResponse|null = res.payload as CLIssueResponse ?? null
        if (!payload || !payload.issue?.WorkTicketKey) {
            return;
        }
        dispatch(setWorkTicketStatus({WorkTicketKey: payload.issue.WorkTicketKey, action: 'cl', nextStatus: 2}))
    }

    const onClickDelete = async () => {
        if (!isCLIssue(current) || !current.DateReceived) {
            return;
        }
        if (window.confirm("Are you sure you want to delete this receiving?")) {
            const res = await dispatch(removeCLReceipt(current.id))
            const payload:CLIssueResponse|null = res.payload as CLIssueResponse ?? null
            if (!payload || !payload.issue?.WorkTicketKey) {
                return;
            }
            dispatch(setWorkTicketStatus({WorkTicketKey: payload.issue.WorkTicketKey, action: 'cl', nextStatus: 1}))

        }
    }

    if (!isCLIssue(current)) {
        return null;
    }

    return (
        <Form onSubmit={submitHandler}>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={4}>
                            <IssueId/>
                        </Col>
                        <Col xs={12} md={8}>
                            <VendorSelect value={current.VendorNo ?? ''} disabled/>
                        </Col>
                    </Row>
                    <IssueWorkTicket containerClassName="mb-1" inputProps={{disabled: true}}/>
                    <IssueTemplate inputProps={{disabled: true}}/>
                    <IssueItem inputProps={{disabled: true}}/>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueDateIssued disabled/>
                        </Col>
                        <Col xs={12} md={6}>
                            <IssueQuantityIssued disabled/>
                        </Col>
                    </Row>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueDateReceived/>
                        </Col>
                        <Col xs={12} md={6}>
                            <IssueQuantityReceived/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={6}>
                    <ReceiptDetail />
                </Col>
            </Row>
            <Stack direction="horizontal" gap={2} className="justify-content-between">
                <div>
                    {status !== 'idle' && (<ProgressBar striped animated now={100}/>)}
                </div>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="button" size="sm" variant="outline-danger"
                            onClick={onClickDelete}
                            disabled={!current.DateReceived}>Delete Receipt</Button>
                    <Button type="submit" size="sm" variant="primary">Receive Work</Button>
                </Stack>
            </Stack>
        </Form>
    )
}
