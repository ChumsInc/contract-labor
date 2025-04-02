import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import TextArea from "../TextArea";

const IssueNotes = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateCurrentEntry({Notes: ev.target.value}));
    }

    return (
        <div className="input-group input-group-sm">
            <label htmlFor={id} className="input-group-text">Notes</label>
            <TextArea id={id} value={current.Notes ?? ''}
                      onChange={changeHandler} minRows={1} maxRows={5}/>
        </div>
    )
}

export default IssueNotes;
