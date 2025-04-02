import React, {useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {newCLEntry, selectCurrentIssueHeader, setNewEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";

const NewEntryButton = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const [show, setShow] = useState(false);
    const dialogContentTextId = useId();

    const newIssueHandler = () => {
        if (current.changed && !!current.id && !show) {
            setShow(true);
            return;
        }
        setShow(false);
        dispatch(setNewEntry(newCLEntry()));
    }

    const handleClose = () => setShow(false);

    return (
        <>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newIssueHandler}>
                New Issue
            </button>
            <Dialog open={show} onClose={handleClose} aria-described-by={dialogContentTextId}>
                <DialogContent>
                    <DialogContentText id={dialogContentTextId}>
                        Cancel changes to this C/L issue?
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button onClick={newIssueHandler}>Yes</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewEntryButton;
