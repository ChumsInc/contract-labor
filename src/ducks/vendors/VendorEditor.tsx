import React, {ChangeEvent, FormEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {saveVendor} from "./actions";
import Alert from "react-bootstrap/Alert";
import {Form, FormText, Stack} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import {CLVendor} from "chums-types";
import {createNewVendor, updateVendor, selectCurrentVendor} from "@/ducks/vendors/index";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const VendorEditor = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentVendor);
    const idVendorNo = useId();
    const idVendorName = useId();
    const idEnabled = useId();

    const changeHandler = (field: keyof CLVendor) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'VendorNo':
                dispatch(updateVendor({[field]: ev.target.value.toUpperCase()}));
                return;
            case 'VendorNameOverride':
                dispatch(updateVendor({[field]: ev.target.value}));
                return;
            case 'active':
                dispatch(updateVendor({[field]: ev.target.checked}));
                return;
        }
    }

    const newVendorHandler = () => {
        if (current?.changed) {

        }
        dispatch(createNewVendor());
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!current) {
            return;
        }
        dispatch(saveVendor(current));
    }

    if (!current) {
        return (
            <div>
                <button type="button" className="btn btn-outline-primary" onClick={newVendorHandler}>New Vendor</button>
            </div>
        )
    }

    return (
        <Form onSubmit={submitHandler}>
            <Row className="g-5">
                <Col sm={6}>
                    <h2>Vendor Editor</h2>
                    <Form.Group as={Row}>
                        <Form.Label column sm={4} htmlFor={idVendorNo}>Sage Vendor No</Form.Label>
                        <Col>
                            <InputGroup size="sm">
                                <FormControl type="text" size="sm" id={idVendorNo}
                                             value={current.VendorNo ?? ''} onChange={changeHandler('VendorNo')} />
                                <InputGroup.Text>ID: {current.id || 'NEW'}</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={4} htmlFor={idVendorName}>Vendor Name</Form.Label>
                        <Col>
                            <FormControl type="text" size="sm" id={idVendorName}
                                         value={current.VendorNameOverride ?? ''}
                                         onChange={changeHandler('VendorNameOverride')}/>
                            <FormText className="text-secondary">Used to override the vendor name from Sage</FormText>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-baseline">
                        <Form.Label column sm={4} htmlFor={idEnabled}>Status</Form.Label>
                        <Col>
                            <FormCheck type="checkbox" label="Active" id={idEnabled}
                                       checked={current.active} onChange={changeHandler('active')}
                                       disabled={current.VendorStatus === 'I'}/>
                        </Col>
                    </Form.Group>
                    <Stack direction="horizontal" gap={3} className="justify-content-end">
                        <Button type="button" size="sm" variant="outline-secondary" onClick={newVendorHandler}>
                            New Vendor
                        </Button>
                        <Button type="submit" size="sm">Save</Button>
                    </Stack>
                </Col>
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label>Vendor Info</Form.Label>
                        <div>{current.VendorName}</div>
                        <address>
                            <div>{current.AddressLine1}</div>
                            <div>{current.AddressLine2}</div>
                            <div>{current.AddressLine3}</div>
                            <div>{current.City}, {current.State} {current.ZipCode}</div>
                        </address>
                        {!!current.EmailAddress &&
                            <a href={`mailto: ${current.EmailAddress}`} target="_blank">{current.EmailAddress}</a>}
                    </Form.Group>
                </Col>
            </Row>
            {current.changed && <Alert variant="warning">Don't forget to save your changes</Alert>}
        </Form>
    )
}

export default VendorEditor;
