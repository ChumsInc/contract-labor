import React, {FormEvent, useCallback, useEffect, useState} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";
import MinDateInput from "@/components/issue-history/MinDateInput";
import MaxDateInput from "@/components/issue-history/MaxDateInput";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {loadHistory} from "@/ducks/issue-history/actions";
import {
    selectActivityCode,
    selectDateType,
    selectItemCode,
    selectMaxDate,
    selectMinDate,
    selectVendorNo,
    selectWarehouseCode
} from "@/ducks/issue-history";
import {IssueSearchOptions} from "@/src/types";
import VendorSelect from "@/components/issue-entry/VendorSelect";
import IssueHistoryVendor from "@/components/issue-history/IssueHistoryVendor";
import IssueHistoryItem from "@/components/issue-history/IssueHistoryItem";
import DateTypeSelect from "@/components/issue-history/DateTypeSelect";
import IssueHistoryWhse from "@/components/issue-history/IssueHistoryWhse";
import IssueHistoryWorkTicket from "@/components/issue-history/IssueHistoryWorkTicket";
import IssueHistoryActivity from "@/components/issue-history/IssueHistoryActivity";

export default function IssueHistoryActionBar() {
    const dispatch = useAppDispatch();
    const dateType = useAppSelector(selectDateType);
    const minDate = useAppSelector(selectMinDate);
    const maxDate = useAppSelector(selectMaxDate);
    const vendorNo = useAppSelector(selectVendorNo);
    const itemCode = useAppSelector(selectItemCode);
    const warehouseCode = useAppSelector(selectWarehouseCode);
    const activityCode = useAppSelector(selectActivityCode);

    const [search, setSearch] = useState<IssueSearchOptions|null>(null);
    const submitHandler = useCallback((ev:FormEvent) => {
        ev.preventDefault();
        console.log(search);
        if (!search) {
            return;
        }
        dispatch(loadHistory(search))
    }, [search])

    useEffect(() => {
        const options:IssueSearchOptions = {
            dateType,
            minDate,
            maxDate,
            vendorNo,
            warehouseCode,
            activityCode,
            itemCode: itemCode.includes('%') ? itemCode : `${itemCode}%`
        }
        setSearch(options)
    }, [dateType, minDate, maxDate, vendorNo, itemCode, warehouseCode, activityCode]);

    return (
        <Row className="g-3 mb-3" as="form" onSubmit={submitHandler}>
            <Col xs="auto">
                <DateTypeSelect />
            </Col>
            <Col xs="auto">
                <MinDateInput required />
            </Col>
            <Col xs="auto">
                <MaxDateInput required />
            </Col>
            <Col xs="auto">
                <IssueHistoryVendor />
            </Col>
            <Col xs="auto">
                <IssueHistoryWhse />
            </Col>
            <Col xs="auto">
                <IssueHistoryItem />
            </Col>
            <Col xs="auto">
                <IssueHistoryActivity />
            </Col>
            <Col xs="auto">
                <IssueHistoryWorkTicket />
            </Col>
            <Col />
            <Col xs="auto">
                <Button type="submit" variant="primary" size="sm">Load</Button>
            </Col>
        </Row>
    )
}
