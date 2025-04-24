import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentVendor} from "./selectors";
import {createNewVendor, saveVendor, updateVendor} from "./actions";
import Alert from "react-bootstrap/Alert";
import {Form} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import {CLVendor} from "chums-types";

const VendorEditor = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentVendor);

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
            <Form.Group>
                <Form.Label>Sage Vendor No</Form.Label>
                <div className="input-group">
                    <input type="text" value={current.VendorNo ?? ''} className="form-control"
                           onChange={changeHandler('VendorNo')}/>
                    <div className="input-group-text">ID: {current.id || 'NEW'}</div>
                </div>
            </Form.Group>
            <Form.Group>
                <Form.Label>Vendor Name</Form.Label>
                <input type="text" value={current.VendorNameOverride ?? ''} className="form-control"
                       onChange={changeHandler('VendorNameOverride')}/>
                <small className="text-muted">Used to override the vendor name from Sage</small>
            </Form.Group>
            <Form.Group>
                <Form.Label>Active</Form.Label>
                <FormCheck type="checkbox" checked={current.active} label="Active" onChange={changeHandler('active')}
                           disabled={current.VendorStatus === 'I'}/>
            </Form.Group>
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
            <Form.Group>
                <Form.Label></Form.Label>
                <div className="row g-3">
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Save</button>

                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-outline-secondary" onClick={newVendorHandler}>
                            New Vendor
                        </button>
                    </div>
                </div>
            </Form.Group>
            {current.changed && <Alert variant="warning">Don't forget to save your changes</Alert>}
        </Form>
    )
}

export default VendorEditor;
