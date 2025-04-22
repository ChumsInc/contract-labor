import React, {useEffect} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import IssueSearchInput from "@/components/issue-list/IssueSearchInput";
import IssueListVendorSelect from "@/components/issue-list/IssueListVendorSelect";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {loadCurrentIssueList} from "@/ducks/issue-list/actions";
import IssueListFilterComplete from "@/components/issue-list/IssueListFilterComplete";
import {filterVendorNo, selectStatus} from "@/ducks/issue-list/issueListSlice";
import {Spinner} from "react-bootstrap";
import {useParams} from "react-router";

export default function IssueListFilters() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectStatus);
    const params = useParams<'vendor'>()

    useEffect(() => {
        dispatch(filterVendorNo(params.vendor ?? ''));
    }, [params.vendor]);

    const reloadHandler = () => {
        dispatch(loadCurrentIssueList())
    }


    return (
        <Row className="mb-1 g-3 align-items-baseline" >
            <Col xs="auto">
                <IssueSearchInput />
            </Col>
            <Col xs="auto">
                <IssueListVendorSelect />
            </Col>
            <Col xs="auto">
                <IssueListFilterComplete />
            </Col>
            <Col/>
            <Col xs="auto">
                {status !== 'idle' && (
                    <Spinner size="sm" variant="secondary" aria-label="loading" />
                )}
            </Col>
            <Col xs="auto">
                <Button type="button" variant="primary" size="sm" onClick={reloadHandler}
                        disabled={status !== 'idle'}>
                    Reload
                </Button>
            </Col>
        </Row>
    )
}
