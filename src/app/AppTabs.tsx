import {NavLink} from "react-router-dom";
import React from "react";

export default function AppTabs() {
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <NavLink className="nav-link" to="/entry">Issue/Receive</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/search">Search</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/vendors">Vendors</NavLink>
            </li>
        </ul>
    )
}
