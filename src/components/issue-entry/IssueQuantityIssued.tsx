import React, {ChangeEvent, useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, updateCurrentQuantity} from "@/ducks/issue-entry/issueEntrySlice";
import dayjs from "dayjs";
import {isCLIssue} from "@/utils/issue";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useDebounceValue} from "usehooks-ts";
import Decimal from "decimal.js";

export interface IssueQuantityProps extends FormControlProps {
    containerClassName?: string;
}

const IssueQuantityIssued = React.forwardRef(({
                                                  containerClassName,
                                                  className,
                                                  ...props
                                              }: IssueQuantityProps, ref: React.Ref<HTMLInputElement>) => {
    const dispatch = useAppDispatch();
    const id = useId();
    const current = useAppSelector(selectCurrentIssueHeader);
    const [value, setValue] = useDebounceValue<string | number>(current.QuantityIssued, 350)

    useEffect(() => {
        if (!new Decimal(value).eq(current.QuantityIssued)) {
            dispatch(updateCurrentQuantity(value));
        }
    }, [value]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.valueAsNumber;
        if (!isNaN(value)) {
            setValue(value);
        } else {
            setValue('');
        }
    }

    const isReceived = isCLIssue(current) && dayjs(current.DateReceived).isValid();

    return (
        <InputGroup size="sm" className={containerClassName}>
            <InputGroup.Text as="label" htmlFor={id}>
                Quantity Issued
            </InputGroup.Text>
            <FormControl type="number" className={className} size="sm"
                         ref={ref}
                         {...props}
                         defaultValue={value || ''} min={0}
                         onChange={changeHandler}
                         readOnly={isReceived}
            />
        </InputGroup>
    )
})

export default IssueQuantityIssued;
