import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentVendor} from "./selectors";
import {Vendor} from "../../types";
import {createNewVendor, saveVendor, updateVendor} from "./actions";
import {emptyVendor} from "./utils";
import {Alert, FormCheck, FormColumn} from "chums-components";

const VendorEditor = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentVendor);

    const changeHandler = (field:keyof Vendor) => (ev:ChangeEvent<HTMLInputElement>) => {
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
        if (current?.changed ) {

        }
        dispatch(createNewVendor());
    }

    const submitHandler = (ev:FormEvent) => {
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
        <form onSubmit={submitHandler}>
            <FormColumn label="Sage Vendor No" width={8}>
                <div className="input-group">
                    <input type="text" value={current.VendorNo ?? ''} className="form-control"
                           onChange={changeHandler('VendorNo')}/>
                    <div className="input-group-text">ID: {current.id || 'NEW'}</div>
                </div>
            </FormColumn>
            <FormColumn label="Vendor Name" width={8}>
                <input type="text" value={current.VendorNameOverride ?? ''} className="form-control" onChange={changeHandler('VendorNameOverride')} />
                <small className="text-muted">Used to override the vendor name from Sage</small>
            </FormColumn>
            <FormColumn label="Active" width={8}>
                <FormCheck type="checkbox" checked={current.active} label="Active" onChange={changeHandler('active')} disabled={current.VendorStatus === 'I'} />
            </FormColumn>
            <FormColumn label="Vendor Info" width={8}>
                <div>{current.VendorName}</div>
                <address>
                    <div>{current.AddressLine1}</div>
                    <div>{current.AddressLine2}</div>
                    <div>{current.AddressLine3}</div>
                    <div>{current.City}, {current.State} {current.ZipCode}</div>
                </address>
                {!!current.EmailAddress && <a href={`mailto: ${current.EmailAddress}`} target="_blank">{current.EmailAddress}</a>}
            </FormColumn>
            <FormColumn label="" width={8}>
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
            </FormColumn>
            {current.changed && <Alert color="warning">Don't forget to save your changes</Alert>}
        </form>
    )
}

export default VendorEditor;
