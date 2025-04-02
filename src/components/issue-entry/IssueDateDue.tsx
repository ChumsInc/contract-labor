import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {toLocalizedDate} from "@/utils/dates";
import {isCLIssue} from "@/utils/issue";
import {FormControlProps, InputGroup} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";

export interface IssueDateDueProps extends FormControlProps {
    containerClassName?: string;
    ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function IssueDateDue({containerClassName, className, ...props}: IssueDateDueProps) {
    const dispatch = useAppDispatch()
    const current = useAppSelector(selectCurrentIssueHeader);
    const id = useId();
    const [value, setValue] = useState<string>(toLocalizedDate(current.DateDue)?.format('YYYY-MM-DD') ?? '');

    useEffect(() => {
        setValue(toLocalizedDate(current.DateDue)?.format('YYYY-MM-DD') ?? '');
    }, [current]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const dateDue = dayjs(ev.target.valueAsDate);
        if (!dateDue.isValid()) {
            return;
        }
        dispatch(updateCurrentEntry({DateDue: dateDue.toISOString()}))
    }

    const disabled = props.disabled
        || (isCLIssue(current) && !!current.DateReceived)
        || (!!current.id && dayjs(current.DateDue).isValid() && dayjs(current.DateDue).isBefore(dayjs().add(-5, 'days')));

    const readOnly = props.readOnly || disabled;

    const min = readOnly
        ? undefined
        : toLocalizedDate(new Date())?.add(-5, 'days').format('YYYY-MM-DD') ?? undefined;
    const max = readOnly ? undefined : dayjs().add(7, 'days').format('YYYY-MM-DD');

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Date Due</InputGroup.Text>
            <FormControl type="date" value={value} onChange={changeHandler} {...props}
                         disabled={disabled} readOnly={readOnly} min={min} max={max}/>
        </InputGroup>
    )
}
