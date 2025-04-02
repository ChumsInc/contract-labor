import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../app/configureStore";
import CLIssueForm from "./issue-entry/CLIssueForm";
import {useParams} from "react-router-dom";
// import {selectCurrentVendor} from "../ducks/issue-list/selectors";
import CLIssueTabs from "./CLIssueTabs";

export default function CLIssueContent() {
    const dispatch = useAppDispatch();
    const params = useParams<'vendor'>();
    const currentVendor = null;
    const [tab, setTab] = useState<string>('issue')

    useEffect(() => {
        // if (params.vendor) {
        //     dispatch(loadCurrentIssueList(params.vendor))
        // }
    }, [params]);

    return (
        <div>
        </div>
    )
}
