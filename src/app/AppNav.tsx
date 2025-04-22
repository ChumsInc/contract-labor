import {NavLink, useLocation} from "react-router";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Offcanvas, Stack} from "react-bootstrap";

export default function AppNav() {
    const location = useLocation();
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(false);
    }, [location]);

    return (
        <>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShow(!show)} aria-label="Toggle navigation">
                <span className="bi-list mx-1" aria-hidden="true"/>
            </Button>
            <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Navigation</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Stack direction="vertical" gap={3}>
                        <NavLink className="nav-link" to="/entry">
                            <span className="bi-card-checklist me-1" aria-hidden="true" /> Issue/Receive
                        </NavLink>
                        <NavLink className="nav-link" to="/search">
                            <span className="bi-search me-1" aria-hidden={true} /> Search
                        </NavLink>
                        <NavLink className="nav-link" to="/vendors">
                            <span className="bi-person me-1" aria-hidden={true} /> Vendors
                        </NavLink>
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
