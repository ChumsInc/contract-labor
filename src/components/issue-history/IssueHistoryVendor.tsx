import React, {ChangeEvent, useId} from 'react';
import {FormSelectProps} from "react-bootstrap/FormSelect";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectVendorNo, setVendorNo} from "@/ducks/issue-history";
import VendorSelect from "@/components/issue-entry/VendorSelect";

export type IssueHistoryVendorProps = Omit<FormSelectProps, 'value' | 'onChange'>;
export default function IssueHistoryVendor(props: IssueHistoryVendorProps) {
    const dispatch = useAppDispatch();
    const vendorNo = useAppSelector(selectVendorNo);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setVendorNo(ev.target.value));
    }

    return (
        <VendorSelect value={vendorNo} onChange={changeHandler} selectAll id={id} {...props} />
    )
}
