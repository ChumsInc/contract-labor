import React, {ChangeEvent, useEffect} from 'react';
import {useDebounceValue} from "usehooks-ts";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

export interface DebouncedInputProps extends Omit<FormControlProps, 'value' | 'onChange'> {
    value: string;
    debounceRate?: number;
    onChange: (value: string) => void;
    ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function DebouncedInput({
                                           value,
                                           onChange,
                                           debounceRate,
                                           ref,
                                           ...props
                                       }: DebouncedInputProps) {
    const [debouncedValue, setValue] = useDebounceValue(value ?? '', debounceRate ?? 500);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value ?? '')
    }

    return (
        <FormControl ref={ref} {...props} defaultValue={value} onChange={changeHandler}/>
    )
}
