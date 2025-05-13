import React, {useCallback, useId, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, selectEntryVendorNo} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useNavigate, useParams} from "react-router";


const NewEntryButton = () => {
    const current = useAppSelector(selectCurrentIssueHeader);
    const entryVendorNo = useAppSelector(selectEntryVendorNo);
    const [show, setShow] = useState(false);
    const dialogContentTextId = useId();
    const params = useParams<'vendor' | 'id'>();
    const navigate = useNavigate();

    const newIssueHandler = useCallback(() => {
        if (current.changed && !show) {
            setShow(true);
            return;
        }
        setShow(false);
        navigate(`/entry/${params.vendor}/new`);
    }, [current, entryVendorNo, show])

    const handleClose = () => setShow(false);

    return (
        <>
            <Button type="button" size="sm" variant="secondary" onClick={newIssueHandler}>
                New Issue
            </Button>
            <Modal show={show} onHide={handleClose} aria-described-by={dialogContentTextId}>
                <Modal.Header closeButton>
                    <Modal.Title id={dialogContentTextId}>
                        Cancel changes to this C/L issue?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Row className="g-3 justify-content-end">
                        <Col xs="auto">
                            <Button onClick={handleClose} variant="secondary">No</Button>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={newIssueHandler} variant="outline-primary">Yes</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NewEntryButton;
