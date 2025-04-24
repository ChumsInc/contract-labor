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
    const [value, setValue] = useState<string>(current.DateDue ? dayjs(current.DateDue).format('YYYY-MM-DD') : '');
    const [minDate, setMinDate] = useState<string>(dayjs(current.DateIssued ?? undefined).format('YYYY-MM-DD'));
    const [maxDate, setMaxDate] = useState<string>(dayjs(current.DateIssued ?? undefined).add(14, 'days').format('YYYY-MM-DD'));
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        setMinDate(dayjs(current.DateIssued ?? new Date()).format('YYYY-MM-DD'));
        setMaxDate(dayjs(current.DateIssued ?? new Date()).add(14, 'days').format('YYYY-MM-DD'));
        setValue(current.DateDue ? dayjs(current.DateDue).format('YYYY-MM-DD') : '');
        setDisabled(props.disabled
            || (isCLIssue(current) && !!current.DateReceived)
            || (!!current.id && dayjs(current.DateDue).isValid() && dayjs(current.DateDue).isBefore(dayjs().add(-5, 'days'))));
    }, [current, props.disabled]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const dateDue = dayjs(ev.target.valueAsDate);
        if (!dateDue.isValid()) {
            return;
        }
        dispatch(updateCurrentEntry({DateDue: toLocalizedDate(dateDue)?.format('YYYY-MM-DD') ?? null}))
    }

    const readOnly = props.readOnly || disabled;

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Date Due</InputGroup.Text>
            <FormControl type="date" value={value} onChange={changeHandler} {...props}
                         disabled={disabled} readOnly={readOnly}
                         min={readOnly ? undefined : minDate} max={readOnly ? undefined : maxDate}/>
        </InputGroup>
    )
}
