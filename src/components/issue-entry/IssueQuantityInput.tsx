import React, {ChangeEvent} from 'react';
import FormControl, {FormControlProps} from "react-bootstrap/FormControl";

export interface IssueQuantityInputProps extends FormControlProps{
    quantityIssued: number | string;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export default function IssueQuantityInput({quantityIssued, onChange, ...rest}: IssueQuantityInputProps) {
    return (
        <FormControl size="sm" type="number" aria-label="Quantity Issued"
                     value={quantityIssued} onChange={onChange}
                     style={{maxWidth: '5rem'}} {...rest}/>
    )
}
