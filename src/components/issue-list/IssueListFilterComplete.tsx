import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {filterShowCompleted, selectFilterShowCompleted} from "@/ducks/issue-list/issueListSlice";
import FormCheck from "react-bootstrap/FormCheck";

export default function IssueListFilterComplete() {
    const dispatch = useAppDispatch();
    const showCompleted = useAppSelector(selectFilterShowCompleted);
    const id = useId();

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(filterShowCompleted(ev.target.checked));
    }
    return (
        <FormCheck type="checkbox" id={id}
                   checked={showCompleted} onChange={changeHandler}
                   label="Show Completed" />
    )
}
