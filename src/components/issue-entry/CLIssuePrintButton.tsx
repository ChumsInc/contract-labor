import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueDetail, selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";
import styled from "@emotion/styled";
import {CLIssue, CLIssueEntry} from "chums-types";
import {CLIssueDetail, CLIssueEntryDetail} from "@/src/types";

const HiddenFrame = styled.iframe`
    position: fixed;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: 0;
`;


function getUrl(current:CLIssue|CLIssueEntry, detail:(CLIssueDetail|CLIssueEntryDetail)[]):string|null {
    if (!current || !current.id) {
        return null;
    }
    const params = new URLSearchParams();
    params.set('now', new Date().valueOf().toString(36));
    return `/api/operations/production/contract-labor/issue/:id.pdf?${params.toString()}`
        .replace(':id', encodeURIComponent(current.id));

}
export interface IssuePrintButtonProps {
    show?: boolean;
    onPrint?: () => void;
}
export default function CLIssuePrintButton({show, onPrint}: IssuePrintButtonProps) {
    const current = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);
    const ref = useRef<HTMLIFrameElement>(null);
    const [url, setUrl] = useState<string | null>(getUrl(current, detail));

    const handleClick = useCallback(() => {
        if (ref.current) {
            ref.current.contentWindow?.focus();
            ref.current.contentWindow?.print();
        }
        onPrint?.();
    }, [url, ref, onPrint]);

    useEffect(() => {
        setUrl(getUrl(current, detail));
    }, [current, detail]);

    useEffect(() => {
        if (show) {
            handleClick()
        }
    }, [show]);

    return (
        <>
            <Button variant="outline-secondary" size="sm" onClick={handleClick} disabled={!current.id || !url}>
                <span className="bi-printer me-1" aria-hidden="true"/>
                Print Issue
            </Button>
            {!!url && <HiddenFrame src={url} ref={ref}/>}
        </>
    )
}
