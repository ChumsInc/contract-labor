import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import WorkTicketList from "@/components/work-ticket-list/WorkTicketList";
import CurrentIssueList from "@/components/issue-list/CurrentIssueList";
import {Accordion} from "react-bootstrap";
import CLIssueTabs from "@/components/CLIssueTabs";
import CLIssueForm from "@/components/issue-entry/CLIssueForm";

const EntryContent = () => {
    const [activeKey, setActiveKey] = React.useState<string>('issue-list');
    const [tab, setTab] = useState<string>('issue')

    return (
        <div>
            <div className="row g-3">
                <div className="col-6">
                    <Accordion defaultActiveKey={activeKey}>
                        <Accordion.Item eventKey="issue-list">
                            <Accordion.Header>
                                Issued Work Tickets
                            </Accordion.Header>
                            <Accordion.Body>
                                <CurrentIssueList/>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="work-ticket-list">
                            <Accordion.Header>
                                Open Work Tickets
                            </Accordion.Header>
                            <Accordion.Body>
                                <WorkTicketList/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <div className="col-6">
                    <CLIssueTabs tab={tab} onChangeTab={setTab}/>
                    {tab === 'issue' && (<CLIssueForm/>)}
                </div>
            </div>
        </div>
    )
}

export default EntryContent;
