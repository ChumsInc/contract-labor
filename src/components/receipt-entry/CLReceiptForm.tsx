import React, {FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import IssueId from "@/components/issue-entry/IssueId";
import VendorSelect from "@/components/issue-entry/VendorSelect";
import IssueWorkTicket from "@/components/issue-entry/IssueWorkTicket";
import IssueTemplate from "@/components/issue-entry/IssueTemplate";
import IssueItem from "@/components/issue-entry/IssueItem";
import IssueDateIssued from "@/components/issue-entry/IssueDateIssued";
import IssueQuantityIssued from "@/components/issue-entry/IssueQuantityIssued";

export default function CLReceiptForm() {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);

    const submitHandler = (ev:FormEvent) => {
        ev.preventDefault();
    }

    return (
        <Form onSubmit={submitHandler}>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueId/>
                        </Col>
                        <Col xs={12} md={6}>
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
                </Col>
            </Row>
        </Form>
    )
}
