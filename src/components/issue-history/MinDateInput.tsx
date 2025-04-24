import React, {useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectMaxDate, selectMinDate, setMinDate} from "@/ducks/issue-history";
import InputGroup from "react-bootstrap/InputGroup";
import dayjs from "dayjs";

const getMaxDate = (date: string) => {
    const max = dayjs(date);
    if (!date || !max.isValid()) {
        return null;
    }
    return max.format('YYYY-MM-DD');
}

export type MinDateInputProps = Omit<FormControlProps, 'type' | 'value' | 'onChange'>

export default function MinDateInput({...props}: MinDateInputProps) {
    const dispatch = useAppDispatch();
    const minDate = useAppSelector(selectMinDate);
    const maxDate = useAppSelector(selectMaxDate);
    const id = useId();
    const [max, setMax] = React.useState<string | null>(getMaxDate(maxDate));

    useEffect(() => {
        setMax(getMaxDate(maxDate));
    }, [maxDate]);

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const date = ev.target.valueAsDate;
        if (!date || !dayjs(date).isValid()) {
            return;
        }
        dispatch(setMinDate(dayjs(date).add(date.getTimezoneOffset(), 'minutes').format('YYYY-MM-DD')))
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Min Date</InputGroup.Text>
            <FormControl type="date" max={max ?? undefined}
                         value={minDate} onChange={changeHandler} {...props}/>
        </InputGroup>
    )
}
