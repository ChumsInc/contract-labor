import React, {useEffect} from 'react';
import {useParams} from "react-router";
import Alert from "react-bootstrap/Alert";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectEntryById} from "@/ducks/issue-list/issueListSlice";
import {loadCLIssueEntry} from "@/ducks/issue-entry/actions";

export default function CLIssueContainer() {
    const dispatch = useAppDispatch();
    const {vendor, id} = useParams();
    const entry = useAppSelector((state) => selectEntryById(state, +(id ?? 0)));

    useEffect(() => {
        if (id) {
            dispatch(loadCLIssueEntry(+id));
        }
    }, [id]);

    if (!id) {
        return null;
    }

    return (
        <Alert variant="warning">Editing: {vendor}/{id}</Alert>
    )
}
