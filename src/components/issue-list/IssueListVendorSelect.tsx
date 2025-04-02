import React from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {filterVendorNo, selectFilterVendorNo} from "@/ducks/issue-list/issueListSlice";
import VendorSelect from "@/components/issue-entry/VendorSelect";


export default function IssueListVendorSelect() {
    const dispatch = useAppDispatch();
    const vendorNo = useAppSelector(selectFilterVendorNo);

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(filterVendorNo(e.currentTarget.value));
    }

    return (
        <VendorSelect selectAll value={vendorNo} onChange={onChange} />
    )
}
