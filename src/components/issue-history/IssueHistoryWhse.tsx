import React, {ChangeEvent, useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectWarehouseCode, setWarehouseCode} from "@/ducks/issue-history";
import {useDebounceValue} from "usehooks-ts";
import InputGroup from "react-bootstrap/InputGroup";

export type IssueHistoryWhseProps = Omit<FormControlProps, 'value'|'onChange'>;

export default function IssueHistoryWhse(props:IssueHistoryWhseProps) {
    const dispatch = useAppDispatch();
    const whse = useAppSelector(selectWarehouseCode);
    const [debouncedValue, setValue] = useDebounceValue(whse, 350);
    const id = useId();

    useEffect(() => {
        dispatch(setWarehouseCode(debouncedValue));
    }, [debouncedValue]);

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value.toUpperCase());
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={props?.id ?? id}>Whse</InputGroup.Text>
            <FormControl type="search" maxLength={3} id={id} style={{maxWidth: '5rem'}}
                         defaultValue={whse.toUpperCase()} onChange={changeHandler} {...props}/>
        </InputGroup>
    )
}
