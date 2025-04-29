import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, updateQuantityIssued} from "@/ducks/issue-entry/issueEntrySlice";
import dayjs from "dayjs";
import {isCLIssue} from "@/utils/issue";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

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

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.valueAsNumber;
        dispatch(updateQuantityIssued(value));
    }

    const isReceived = isCLIssue(current) && dayjs(current.DateReceived).isValid();

    return (
        <InputGroup size="sm" className={containerClassName}>
            <InputGroup.Text as="label" htmlFor={id}>
                <span aria-label="Quantity Issued">Qty</span>
            </InputGroup.Text>
            <FormControl type="number" className={className} id={id} size="sm"
                         ref={ref}
                         {...props}
                         value={current.QuantityIssued || ''} min={0}
                         onChange={changeHandler}
                         readOnly={isReceived}
            />
        </InputGroup>
    )
})

export default IssueQuantityIssued;
