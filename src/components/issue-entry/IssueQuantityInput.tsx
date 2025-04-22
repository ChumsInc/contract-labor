import React, {ChangeEvent} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

export interface IssueQuantityInputProps extends FormControlProps{
    quantity: number | string;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export default function IssueQuantityInput({quantity, onChange, ...rest}: IssueQuantityInputProps) {
    return (
        <FormControl size="sm" type="number" aria-label="Quantity Issued"
                     value={quantity} onChange={onChange}
                     style={{maxWidth: '5rem'}} {...rest}/>
    )
}
