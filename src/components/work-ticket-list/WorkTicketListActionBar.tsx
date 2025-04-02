import React, {ChangeEvent, useEffect, useId} from 'react';
import WorkTicketStatusBadge from "@/components/work-ticket-list/WorkTicketStatusBadge";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {loadWorkTicketStatusList} from "@/ducks/work-ticket/actions";
import {selectWTListSearch, selectWTListStatus, setWTListSearch} from "@/ducks/work-ticket/workTicketListSlice";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col'
import {useDebounceValue} from "usehooks-ts";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";


export default function WorkTicketListActionBar() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectWTListStatus);
    const search = useAppSelector(selectWTListSearch);
    const [value, setValue] = useDebounceValue(search, 500);
    const id = useId();

    useEffect(() => {
        dispatch(loadWorkTicketStatusList());
    }, []);

    useEffect(() => {
        dispatch(setWTListSearch(value));
    }, [value]);

    const loadWorkTicketsHandler = () => {
        dispatch(loadWorkTicketStatusList());
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    }

    return (
        <Row className="row g-1 align-items-baseline">
            <Col xs="auto">
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={id}>Search</InputGroup.Text>
                    <FormControl type="search" id={id} size="sm" autoComplete="off"
                                 defaultValue={search} onChange={changeHandler}/>
                </InputGroup>
            </Col>
            <Col xs="auto">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={loadWorkTicketsHandler}
                        disabled={status !== 'idle'}>
                    Reload
                </button>
            </Col>
            <Col className="col"></Col>
            <Col xs="auto">Legend:</Col>
            <Col xs="auto">
                <WorkTicketStatusBadge text="In Process" status={{style: 1}}/>
            </Col>
            <Col xs="auto">
                <WorkTicketStatusBadge text="Done" status={{style: 2}}/>
            </Col>
            <Col xs="auto">
                <WorkTicketStatusBadge text="Waiting on Product" status={{style: 3}}/>
            </Col>
            <Col xs="auto">
                <WorkTicketStatusBadge text="On Hold" status={{style: 4}}/>
            </Col>
        </Row>
    )
}
