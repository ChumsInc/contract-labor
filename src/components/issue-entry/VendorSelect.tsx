import React, {useId} from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectVendorList} from "@/ducks/vendors";
import {sortVendors} from "@/ducks/vendors/utils";
import InputGroup, {InputGroupProps} from "react-bootstrap/InputGroup";
import FormSelect, {FormSelectProps} from 'react-bootstrap/FormSelect'

export interface VendorSelectProps extends FormSelectProps {
    selectAll?: boolean;
    inputGroupProps?: InputGroupProps;
    label?: string | React.ReactNode;
}

export default function VendorSelect({
                                         value,
                                         onChange,
                                         selectAll,
                                         inputGroupProps,
                                         label,
                                         id,
                                         ...rest
                                     }: VendorSelectProps) {
    const vendors = useAppSelector(selectVendorList);
    const _id = useId();
    return (
        <InputGroup size="sm" {...inputGroupProps}>
            <InputGroup.Text as="label" htmlFor={id ?? _id}>{label ?? 'Vendor'}</InputGroup.Text>
            <FormSelect id={id ?? _id} value={value} onChange={onChange} {...rest}>
                {selectAll && (<option value="">All</option>)}
                <option disabled={!rest.required} value="">-</option>
                {vendors
                    .filter(v => v.active)
                    .sort(sortVendors({field: 'VendorNameOverride', ascending: true}))
                    .map(v => <option key={v.id} value={v.VendorNo}>{v.VendorNameOverride}</option>)}
            </FormSelect>
        </InputGroup>
    )
}

