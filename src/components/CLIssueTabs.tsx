import React from 'react';
import {Nav} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VendorTotals from "@/components/vendor-totals/VendorTotals";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";


export default function CLIssueTabs({tab, onChangeTab}: {
    tab: string;
    onChangeTab: (tab: string) => void;
}) {
    const current = useAppSelector(selectCurrentIssueHeader);

    const selectHandler = (eventKey: string | null) => {
        if (eventKey) {
            onChangeTab(eventKey);
        }
    }
    return (
        <Row>
            <Col xs="auto">
                <Nav variant="underline" activeKey={tab} onSelect={selectHandler} className="mb-3" >
                    <Nav.Item>
                        <Nav.Link eventKey="issue">Issue</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="receive" disabled={current.id === 0}>Receive</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
            <Col />
            <Col xs="auto">
                <VendorTotals />
            </Col>
        </Row>
    )
}
