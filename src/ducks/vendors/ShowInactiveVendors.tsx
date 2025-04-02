import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectShowInactive} from "./selectors";
import {toggleShowInactive} from "./actions";
import FormCheck from "react-bootstrap/FormCheck";


const ShowInactiveVendors = () => {
    const dispatch = useAppDispatch();
    const showInactive = useSelector(selectShowInactive);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    return <FormCheck type="checkbox" id={id} label="Show Inactive"
                      checked={showInactive} onChange={changeHandler}/>
}
export default ShowInactiveVendors;
