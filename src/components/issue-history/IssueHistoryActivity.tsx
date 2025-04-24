import React, {ChangeEvent, useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectActivityCode, setActivityCode} from "@/ducks/issue-history";
import {useDebounceValue} from "usehooks-ts";
import InputGroup from "react-bootstrap/InputGroup";

export type IssueHistoryActivityProps = Omit<FormControlProps, 'value' | 'onChange'>;

export default function IssueHistoryActivity(props: IssueHistoryActivityProps) {
    const dispatch = useAppDispatch();
    const value = useAppSelector(selectActivityCode);
    const [debouncedValue, setValue] = useDebounceValue(value, 350);
    const id = useId();

    useEffect(() => {
        dispatch(setActivityCode(debouncedValue));
    }, [debouncedValue]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value.toUpperCase());
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={props?.id ?? id}>Activity</InputGroup.Text>
            <FormControl type="search" id={id}
                         defaultValue={value.toUpperCase()} onChange={changeHandler} {...props}/>
        </InputGroup>
    )
}
