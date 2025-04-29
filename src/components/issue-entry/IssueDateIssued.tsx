import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import {toLocalizedDate} from "@/utils/dates";
import {isCLIssue} from "@/utils/issue";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

export interface IssueDateIssuedProps extends FormControlProps {
    containerClassName?: string;
    ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function IssueDateIssued({containerClassName, ref, ...props}: IssueDateIssuedProps) {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const id = useId();
    const [value, setValue] = useState<string>(dayjs(current.DateIssued ?? undefined).format('YYYY-MM-DD'));

    useEffect(() => {
        setValue(dayjs(current.DateIssued ?? undefined).format('YYYY-MM-DD'));
    }, [current]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const dateIssued = dayjs(ev.target.valueAsDate);
        if (!dateIssued.isValid()) {
            return;
        }
        dispatch(updateCurrentEntry({DateIssued: toLocalizedDate(dateIssued)?.format('YYYY-MM-DD') ?? null,}))
    }

    const disabled = props.disabled
        || (isCLIssue(current) && !!current.DateReceived)
        || (!!current.id
            && dayjs(current.DateIssued).isValid()
            && dayjs(current.DateIssued).isBefore(dayjs().add(-5, 'days'))
        );

    const readOnly = props.readOnly || disabled;

    const min = readOnly
        ? undefined
        : toLocalizedDate(new Date())?.add(-5, 'days').format('YYYY-MM-DD') ?? undefined;

    const max = readOnly ? undefined : dayjs().add(7, 'days').format('YYYY-MM-DD');

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Issued</InputGroup.Text>
            <FormControl type="date" id={id} value={value} onChange={changeHandler}
                         disabled={disabled} readOnly={readOnly} min={min} max={max}/>
        </InputGroup>
    )
}

