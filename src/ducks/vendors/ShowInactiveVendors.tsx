import React, {ChangeEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectShowInactive} from "./selectors";
import {toggleShowInactive} from "./actions";
import {FormCheck} from "chums-components";

const ShowInactiveVendors = () => {
    const dispatch = useAppDispatch();
    const showInactive = useSelector(selectShowInactive);
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    return <FormCheck type="checkbox" checked={showInactive} label="Show Inactive" onChange={changeHandler}/>
}
export default ShowInactiveVendors;
