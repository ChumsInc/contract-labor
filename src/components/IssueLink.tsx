import React from 'react';
import {generatePath, Link} from "react-router";

export interface IssueLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    issueId: number | string;
    vendorNo: string;
}

export default function IssueLink({issueId, vendorNo, ...rest}: IssueLinkProps) {
    if (!issueId) {
        return null;
    }
    const path = generatePath('/entry/:vendor/:id', {vendor: vendorNo, id: issueId.toString()});
    return (
        <Link to={path} {...rest} >{issueId}</Link>
    )
}
