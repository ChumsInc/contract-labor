import React, {use, useEffect, useId} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectMaxDate, selectMinDate, setMaxDate, setMinDate} from "@/ducks/issue-history";
import InputGroup from "react-bootstrap/InputGroup";
import dayjs from "dayjs";

const getMinDate = (date:string) => {
    const max = dayjs(date);
    if (!date || !max.isValid()) {
        return null;
    }
    return max.format('YYYY-MM-DD');
}

export type MaxDateInputProps = Omit<FormControlProps, 'type'|'value'|'onChange'>

export default function MaxDateInput({...props}: MaxDateInputProps) {
    const dispatch = useAppDispatch();
    const minDate = useAppSelector(selectMinDate);
    const maxDate = useAppSelector(selectMaxDate);
    const id = useId();
    const [min, setMin] = React.useState<string|null>(getMinDate(minDate));

    useEffect(() => {
        setMin(getMinDate(minDate));
    }, [minDate]);

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const date = ev.target.valueAsDate;
        if (!date || !dayjs(date).isValid()) {
            return;
        }
        dispatch(setMaxDate(dayjs(date).add(date.getTimezoneOffset(), 'minutes').format('YYYY-MM-DD')))
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Max Date</InputGroup.Text>
            <FormControl type="date" min={min ?? undefined}
                         value={maxDate} onChange={changeHandler} {...props}/>
        </InputGroup>
    )
}
