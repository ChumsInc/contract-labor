import React, {useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {newCLEntry, selectCurrentIssueHeader, setNewEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {isCLIssue} from "@/utils/issue";
import dayjs from "dayjs";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {removeCLIssueEntry} from "@/ducks/issue-entry/actions";
import {setWorkTicketStatus} from "@/ducks/work-ticket/actions";
import {useNavigate, useParams} from "react-router";

const DeleteEntryButton = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const [show, setShow] = useState(false);
    const [canDelete, setCanDelete] = useState(isCLIssue(current) || (isCLIssue(current) && !dayjs(current.DateReceived).isValid()))
    const dialogContentTextId = useId();
    const params = useParams<'vendor'|'id'>();
    const navigate = useNavigate();

    useEffect(() => {
        setCanDelete(isCLIssue(current) || (isCLIssue(current) && !dayjs(current.DateReceived).isValid()))
    }, [current]);

    const deleteIssueHandler = async () => {
        if (canDelete && !show) {
            setShow(true);
            return;
        }
        setShow(false);
        await dispatch(removeCLIssueEntry(current))
        if (isCLIssue(current) && current.WorkTicketKey) {
            await dispatch(setWorkTicketStatus({WorkTicketKey: current.WorkTicketKey, action: 'cl', nextStatus: 0}))
        }
        navigate(`/entry/${params.vendor}/new`);
    }

    const handleClose = () => setShow(false);

    return (
        <>
            <Button type="button" variant="outline-danger" size="sm"
                    onClick={deleteIssueHandler}
                    disabled={!isCLIssue(current) || (isCLIssue(current) && dayjs(current.DateReceived).isValid())}>
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
                            <Button onClick={handleClose} autoFocus variant="secondary">No</Button>
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
