import React, {useEffect} from 'react';
import {Outlet} from "react-router";
import styled from "@emotion/styled";
import AppNav from "./AppNav";
import {useAppDispatch} from "./configureStore";
import {loadVendors} from "@/ducks/vendors/actions";
import AlertList from "../components/alerts/AlertList";
import {loadTemplates} from "@/ducks/templates/actions";

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
            <AppNav />
            <AlertList />
            <AppContent>
                <Outlet/>
            </AppContent>
        </div>
    )
}
