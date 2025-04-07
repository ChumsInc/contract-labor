import React, {useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {newCLEntry, selectCurrentIssueHeader, setNewEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {isCLIssue} from "@/utils/issue";
import dayjs from "dayjs";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const DeleteEntryButton = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const [show, setShow] = useState(false);
    const [canDelete, setCanDelete] = useState(isCLIssue(current) || (isCLIssue(current) && !dayjs(current.DateReceived).isValid()))
    const dialogContentTextId = useId();

    useEffect(() => {
        setCanDelete(isCLIssue(current) || (isCLIssue(current) && !dayjs(current.DateReceived).isValid()))
    }, [current]);

    const deleteIssueHandler = async () => {
        if (canDelete && !show) {
            setShow(true);
            return;
        }
        setShow(false);
        // await dispatch
        dispatch(setNewEntry(newCLEntry()));
    }

    const handleClose = () => setShow(false);

    return (
        <>
            <Button type="button" variant="outline-danger" size="sm" onClick={deleteIssueHandler}>
                Delete Issue
            </Button>
            <Modal show={show} onHide={handleClose} aria-described-by={dialogContentTextId}>
                <Modal.Header>
                    <Modal.Title id={dialogContentTextId}>
                        Delete this C/L issue?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row  className="g-3">
                        <Col xs="auto">
                            <Button onClick={handleClose} autoFocus variant="outline-secondary">No</Button>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={deleteIssueHandler} variant="danger">Yes</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DeleteEntryButton;
