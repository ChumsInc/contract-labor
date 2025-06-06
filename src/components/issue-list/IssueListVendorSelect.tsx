import React from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectFilterVendorNo} from "@/ducks/issue-list/issueListSlice";
import VendorSelect from "@/components/issue-entry/VendorSelect";
import {generatePath, useNavigate} from "react-router";


export default function IssueListVendorSelect() {
    const vendorNo = useAppSelector(selectFilterVendorNo);
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(generatePath('/entry/:vendor', {vendor: e.currentTarget.value ?? ''}));
    }

    return (
        <VendorSelect selectAll value={vendorNo} onChange={onChange}/>
    )
}
