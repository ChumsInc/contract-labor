import React, {ChangeEvent, useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueHeader,
    selectIssueHeader,
    updateQuantityIssued,
    updateQuantityReceived
} from "@/ducks/issue-entry/issueEntrySlice";
import dayjs from "dayjs";
import {isCLIssue} from "@/utils/issue";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";
import {useDebounceValue} from "usehooks-ts";
import Decimal from "decimal.js";

export interface IssueQuantityProps extends FormControlProps {
    containerClassName?: string;
}

const IssueQuantityReceived = React.forwardRef(({
                                                  containerClassName,
                                                  className,
                                                  ...props
                                              }: IssueQuantityProps, ref: React.Ref<HTMLInputElement>) => {
    const dispatch = useAppDispatch();
    const id = useId();
    const current = useAppSelector(selectIssueHeader);


    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.valueAsNumber;
        dispatch(updateQuantityReceived(value));
    }

    if (!current) {
        return null;
    }

    return (
        <InputGroup size="sm" className={containerClassName}>
            <InputGroup.Text as="label" htmlFor={id}>
                <span aria-label="Quantity Received">Qty</span>
            </InputGroup.Text>
            <FormControl type="number" className={className} size="sm"
                         ref={ref}
                         {...props}
                         value={current.QuantityReceived || ''} min={0}
                         onChange={changeHandler}
            />
        </InputGroup>
    )
})

export default IssueQuantityReceived;
