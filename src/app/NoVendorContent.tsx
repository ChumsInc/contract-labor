import React from 'react';
import CLIssueForm from "@/components/issue-entry/CLIssueForm";
import Alert from "react-bootstrap/Alert";

export default function NoVendorContent() {
    return (
        <div>
            <Alert variant="info">Select a Vendor or Enter new issue below</Alert>
            <CLIssueForm/>
        </div>
    )
}
