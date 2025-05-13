import React from 'react';
import {generatePath, Link} from "react-router";
import {CLIssue} from "chums-types";

export interface IssueLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    issue: CLIssue;
}
export default function IssueLink({issue, ...rest}: IssueLinkProps) {
    if (!issue || !issue.id) {
        return null;
    }
    const path = generatePath('/entry/:vendor/:id', {vendor: issue.VendorNo, id: issue.id.toString()});
    return (
        <Link to={path} {...rest} >{issue.id}</Link>
    )
}
