import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import Alert from "react-bootstrap/Alert";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {loadCLIssueEntry} from "@/ducks/issue-entry/actions";
import CLIssueForm from "@/components/issue-entry/CLIssueForm";
import CLIssueTabs from "@/components/CLIssueTabs";
import CLReceiptForm from "@/components/receipt-entry/CLReceiptForm";
import {newCLEntry, selectCurrentIssueHeader, setNewEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {isCLIssue} from "@/utils/issue";

export default function CLIssueContainer() {
    const dispatch = useAppDispatch();
    const {vendor, id} = useParams();
    const [tab, setTab] = useState<'issue' | 'receive' | string>('issue');
    const current = useAppSelector(selectCurrentIssueHeader);

    useEffect(() => {
        if (id === 'new') {
            dispatch(setNewEntry(newCLEntry(vendor)));
            return;
        }
        if (id) {
            dispatch(loadCLIssueEntry(+id));
        }
    }, [vendor, id]);

    return (
        <div>
            <CLIssueTabs tab={tab} onChangeTab={setTab}/>
            {tab === 'issue' && (<CLIssueForm/>)}
            {tab === 'receive' && (<CLReceiptForm/>)}
            {!!current.id && isCLIssue(current) && !!current.DateReceived && (
                <Alert variant="danger">Warning: {vendor}/{id} has already been received</Alert>
            )}
        </div>

    )
}
