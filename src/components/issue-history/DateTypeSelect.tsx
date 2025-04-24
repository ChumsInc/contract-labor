import React, {ChangeEvent, useId} from 'react';
import FormSelect, {FormSelectProps} from "react-bootstrap/FormSelect";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectDateType, setDateType} from "@/ducks/issue-history";
import {IssueDateType} from "@/src/types";
import InputGroup from "react-bootstrap/InputGroup";

export type DateTypeSelectProps = Omit<FormSelectProps, 'value'|'onChange'>;

export default function DateTypeSelect(props:DateTypeSelectProps) {
    const dispatch = useAppDispatch();
    const dateType = useAppSelector(selectDateType);
    const id = useId();

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDateType(ev.target.value as IssueDateType));
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={props.id ?? id}>Search</InputGroup.Text>
            <FormSelect value={dateType} onChange={changeHandler} id={id} {...props}>
                <option value="I">Issued</option>
                <option value="D">Due</option>
                <option value="R">Received</option>
            </FormSelect>
        </InputGroup>
    )
}
