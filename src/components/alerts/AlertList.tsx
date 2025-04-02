import React from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../app/configureStore";
import ContextAlert from "./ContextAlert";
import {dismissAlert, selectAllAlerts} from "@chumsinc/alert-list";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectAllAlerts);

    const dismissHandler = (id: number) => {
        dispatch(dismissAlert({id}));
    }
    return (
        <div>
            {list.map(alert => (
                <ContextAlert key={alert.id} variant={alert.variant} dismissible
                              onClose={() => dismissHandler(alert.id)}
                              context={alert.context} count={alert.count}>
                    {alert.message}
                </ContextAlert>
            ))}
        </div>
    )
}
export default AlertList;
