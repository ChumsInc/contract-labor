import React, {ChangeEvent, useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectItemCode, setItemCode} from "@/ducks/issue-history";
import {useDebounceValue} from "usehooks-ts";

export type IssueHistoryItemProps = Omit<FormControlProps, 'value' | 'onChange'>;
export default function IssueHistoryItem(props: IssueHistoryItemProps) {
    const dispatch = useAppDispatch();
    const itemCode = useAppSelector(selectItemCode);
    const [debouncedValue, setValue] = useDebounceValue(itemCode, 350);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value.toUpperCase());
    }

    useEffect(() => {
        dispatch(setItemCode(debouncedValue));
    }, [debouncedValue]);

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={props?.id ?? id}>Item</InputGroup.Text>
            <FormControl type="search" id={id} defaultValue={itemCode.toUpperCase()} onChange={changeHandler}
                         {...props} />
        </InputGroup>
    )
}
