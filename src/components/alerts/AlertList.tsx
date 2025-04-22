import React from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/app/configureStore";
import ContextAlert from "./ContextAlert";
import {dismissAlert, selectAllAlerts, StyledErrorAlert} from "@chumsinc/alert-list";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectAllAlerts);

    const dismissHandler = (alert:StyledErrorAlert) => {
        dispatch(dismissAlert(alert));
    }
    return (
        <div>
            {list.map(alert => (
                <ContextAlert key={alert.id} variant="warning" dismissible
                              onClose={() => dismissHandler(alert)}
                              context={alert.context} count={alert.count}>
                    {alert.message}
                </ContextAlert>
            ))}
        </div>
    )
}
export default AlertList;
