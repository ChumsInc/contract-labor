import React, {useId} from "react";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {FormText} from "react-bootstrap";

export interface IssueItemProps {
    inputProps?: Omit<FormControlProps, 'value'|'onChange'>;
}
export default function IssueItem({inputProps}:IssueItemProps) {
    const current = useAppSelector(selectCurrentIssueHeader);
    const whseId = useId();
    const itemId = useId();

    return (
        <div className="mb-1">
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={itemId}>Item</InputGroup.Text>
                        <FormControl type="text" size="sm" {...inputProps}
                                     id={itemId}
                                     value={current.ItemCode ?? ''} readOnly/>
                    </InputGroup>
                </Col>
                <Col xs={12} md={6}>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={whseId}>Warehouse</InputGroup.Text>
                        <FormControl type="text"  size="sm" {...inputProps}
                                     id={whseId}
                                     value={current.WarehouseCode ?? ''} readOnly/>
                    </InputGroup>
                </Col>
            </Row>
            {current && (<FormText>{current.ItemCodeDesc}</FormText>)}
        </div>
    )
}

