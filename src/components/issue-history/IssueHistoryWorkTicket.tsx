import React, {ChangeEvent, useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectWorkTicketNo, setWorkTicketNo} from "@/ducks/issue-history";
import {useDebounceValue} from "usehooks-ts";
import InputGroup from "react-bootstrap/InputGroup";

export type IssueHistoryWorkTicketProps = Omit<FormControlProps, 'onChange'|'value'|'defaultValue'>
export default function IssueHistoryWorkTicket(props:IssueHistoryWorkTicketProps) {
    const dispatch = useAppDispatch();
    const value = useAppSelector(selectWorkTicketNo);
    const [debouncedValue, setValue] = useDebounceValue(value, 350);
    const id = useId();

    useEffect(() => {
        dispatch(setWorkTicketNo(debouncedValue))
    }, [debouncedValue]);

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value)
    }
    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={props.id ?? id}>WT#</InputGroup.Text>
            <FormControl type="search" defaultValue={value} onChange={changeHandler} id={id} {...props} />
        </InputGroup>
    )
}
