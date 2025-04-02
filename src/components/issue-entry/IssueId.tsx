import React, {useId} from 'react';
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import {useAppSelector} from "@/app/configureStore";

const IssueId = () => {
    const issue = useAppSelector(selectCurrentIssueHeader);
    const id = useId();
    return (
        <div className="input-group input-group-sm">
            <label className="input-group-text" htmlFor={id}>ID</label>
            <input type="text" value={issue.id || 'New'} className="form-control form-control-sm" readOnly/>
        </div>
    )
}

export default IssueId;
