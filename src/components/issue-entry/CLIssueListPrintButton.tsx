import React, {ChangeEvent, useEffect, useId, useRef} from 'react';
import {useAppSelector} from "@/app/configureStore";
import Button from "react-bootstrap/Button";
import styled from "@emotion/styled";
import {selectFilteredIssueList, selectFilterVendorNo} from "@/ducks/issue-list/issueListSlice";
import InputGroup from "react-bootstrap/InputGroup";
import dayjs from "dayjs";
import FormControl from "react-bootstrap/FormControl";

const HiddenFrame = styled.iframe`
    position: fixed;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: 0;
    display: hidden;
`


export default function CLIssueListPrintButton() {
    const list = useAppSelector(selectFilteredIssueList);
    const vendorNo = useAppSelector(selectFilterVendorNo);
    const ref = useRef<HTMLIFrameElement>(null);
    const [issueDate, setIssueDate] = React.useState<string | null>(dayjs().format('YYYY-MM-DD'));
    const [url, setUrl] = React.useState<string | null>(null);
    const id = useId();

    useEffect(() => {
        if (!issueDate || !vendorNo) {
            setUrl(null);
            return;
        }
        const params = new URLSearchParams();
        params.set('minDate', dayjs(issueDate).format('YYYY-MM-DD'));
        params.set('maxDate', dayjs(issueDate).format('YYYY-MM-DD'));
        params.set('dateType', 'I');
        params.set('now', new Date().valueOf().toString(36));
        const url = `/api/operations/production/contract-labor/issue/current/:vendorNo.html?${params.toString()}`
            .replace(':vendorNo', encodeURIComponent(vendorNo));
        setUrl(url);
    }, [vendorNo, issueDate, list]);


    const handleClick = () => {
        if (ref.current) {
            ref.current.contentWindow?.focus();
            ref.current.contentWindow?.print();
        }
    }

    const handleDateChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (dayjs(ev.target.value).isValid()) {
            setIssueDate(ev.target.value);
        }
    }

    return (
        <div>
            <InputGroup size="sm">
                <InputGroup.Text as="label" htmlFor={id}>Issue Date</InputGroup.Text>
                <FormControl type="date" id={id} value={issueDate ?? undefined} onChange={handleDateChange}/>
                <Button variant="info" size="sm" onClick={handleClick} disabled={!vendorNo} aria-label="Print Issue">
                    <span className="bi-printer me-1" aria-hidden="true"/>
                </Button>
            </InputGroup>
            {!!url && (
                <HiddenFrame ref={ref} src={url} aria-hidden="true"/>
            )}
        </div>
    )
}
