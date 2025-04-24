import React, {useEffect, useState} from 'react';
import WorkTicketList from "@/components/work-ticket-list/WorkTicketList";
import CurrentIssueList from "@/components/issue-list/CurrentIssueList";
import {Nav} from "react-bootstrap";
import CLIssueTabs from "@/components/CLIssueTabs";
import CLIssueForm from "@/components/issue-entry/CLIssueForm";
import CLReceiptForm from "@/components/receipt-entry/CLReceiptForm";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "@/components/ErrorBoundaryFallbackAlert";

const EntryContent = () => {
    const current = useAppSelector(selectCurrentIssueHeader);
    const [activeKey, setActiveKey] = React.useState<string | null>('issue-list');
    const [tab, setTab] = useState<'issue' | 'receive' | string>('issue');

    useEffect(() => {
        if (tab === 'receive' && !current.id) {
            setTab('issue');
        }
    }, [current, tab]);

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div className="row g-3">
                <div className="col-6">
                    <Nav variant="tabs" className="mb-3"
                         activeKey={activeKey ?? 'issue-list'} onSelect={setActiveKey}>
                        <Nav.Item>
                            <Nav.Link eventKey="issue-list">Issued Work Tickets</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="work-ticket-list">Open Work Tickets</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {activeKey === 'issue-list' && (<CurrentIssueList/>)}
                    {activeKey === 'work-ticket-list' && (<WorkTicketList/>)}
                </div>
                <div className="col-6">
                    <CLIssueTabs tab={tab} onChangeTab={setTab}/>
                    {tab === 'issue' && (<CLIssueForm/>)}
                    {tab === 'receive' && (<CLReceiptForm/>)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default EntryContent;
