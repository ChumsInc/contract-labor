import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useParams} from "react-router";
// import {selectCurrentVendor} from "../ducks/issue-list/selectors";

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
