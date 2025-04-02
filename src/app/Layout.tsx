import React, {useEffect} from 'react';
import {NavLink, Outlet} from "react-router-dom";
import styled from "@emotion/styled";
import AppTabs from "./AppTabs";
import {useAppDispatch} from "./configureStore";
import {loadVendors} from "../ducks/vendors/actions";
import AlertList from "../components/alerts/AlertList";
import {loadTemplates} from "../ducks/templates/actions";

const AppContent = styled.div`
    margin-top: 0.5rem;
`

export default function Layout() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadVendors());
        dispatch(loadTemplates());
    }, []);

    return (
        <div>
            <AppTabs />
            <AlertList />
            <AppContent>
                <Outlet/>
            </AppContent>
        </div>
    )
}
