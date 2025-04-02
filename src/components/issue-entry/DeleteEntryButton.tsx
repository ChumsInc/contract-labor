import React, {useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {newCLEntry, selectCurrentIssueHeader, setNewEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import {isCLIssue} from "@/utils/issue";
import dayjs from "dayjs";

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
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={deleteIssueHandler}>
                Delete Issue
            </button>
            <Dialog open={show} onClose={handleClose} aria-described-by={dialogContentTextId}>
                <DialogContent>
                    <DialogContentText id={dialogContentTextId}>
                        Delete this C/L issue?
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>No</Button>
                        <Button onClick={deleteIssueHandler} color="error">Yes</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteEntryButton;
