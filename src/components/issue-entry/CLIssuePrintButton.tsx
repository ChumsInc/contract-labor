import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueDetail, selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Button from "react-bootstrap/Button";
import styled from "@emotion/styled";

const HiddenFrame = styled.iframe`
    position: fixed;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: 0;
`
export default function CLIssuePrintButton() {
    const current = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);
    const ref = useRef<HTMLIFrameElement>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!current || !current.id) {
            setUrl(null);
            return;
        }
        const params = new URLSearchParams();
        params.set('now', new Date().valueOf().toString(36));
        const url = `/api/operations/production/contract-labor/issue/:id.pdf?${params.toString()}`
            .replace(':id', encodeURIComponent(current.id));
        setUrl(url);
    }, [current, detail]);

    const handleClick = () => {
        if (ref.current) {
            ref.current.contentWindow?.focus();
            ref.current.contentWindow?.print();
        }
    }

    return (
        <>
            <Button variant="outline-secondary" size="sm" onClick={handleClick} disabled={!current.id}>
                <span className="bi-printer me-1" aria-hidden="true"/>
                Print Issue
            </Button>
            {!!current.id && !!url && <HiddenFrame src={url} ref={ref}/>}
        </>
    )
}
