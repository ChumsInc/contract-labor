import React, {useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {useDebounceValue} from "usehooks-ts";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {filterSearch, selectFilterSearch} from "@/ducks/issue-list/issueListSlice";

export default function IssueSearchInput() {
    const dispatch = useAppDispatch();
    const search = useAppSelector(selectFilterSearch);
    const [value, setValue] = useDebounceValue<string>(search, 350);
    const id = useId();

    useEffect(() => {
        dispatch(filterSearch(value))
    }, [value]);

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Search</InputGroup.Text>
            <FormControl type="search" defaultValue={search}
                         onChange={(ev) => setValue(ev.target.value)}/>
        </InputGroup>
    )
}
