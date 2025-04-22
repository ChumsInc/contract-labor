import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {toLocalizedDate} from "@/utils/dates";
import {isCLIssue} from "@/utils/issue";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

export interface IssueDateIssuedProps extends FormControlProps {
    containerClassName?: string;
    ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function IssueDateReceived({containerClassName, ref, ...props}: IssueDateIssuedProps) {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectIssueHeader);
    const id = useId();
    const [value, setValue] = useState<string>(dayjs(current?.DateReceived ?? undefined).format('YYYY-MM-DD'));

    useEffect(() => {
        setValue(dayjs(current?.DateReceived ?? undefined).format('YYYY-MM-DD'));
    }, [current]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const dateReceived = dayjs(ev.target.valueAsDate);
        if (!dateReceived.isValid()) {
            return;
        }
        dispatch(updateCurrentEntry({DateReceived: toLocalizedDate(dateReceived)?.format('YYYY-MM-DD') ?? null}))
    }

    const disabled = props.disabled ?? (current && isCLIssue(current) && !!current.DateReceived) ?? false;
    const readOnly = props.readOnly || disabled;

    const min = readOnly
        ? undefined
        : (dayjs(current?.DateIssued ?? undefined).format('YYYY-MM-DD'));

    const max = readOnly ? undefined : dayjs().add(7, 'days').format('YYYY-MM-DD');

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Received</InputGroup.Text>
            <FormControl type="date" value={value} onChange={changeHandler}
                         disabled={disabled} readOnly={readOnly} min={min} max={max}/>
        </InputGroup>
    )
}

