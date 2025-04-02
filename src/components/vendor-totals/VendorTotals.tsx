import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectSortedVendorTotals} from "@/ducks/vendor-totals/vendorTotalsSlice";
import Button from "react-bootstrap/Button";
import {Offcanvas} from "react-bootstrap";
import VendorTotalCard from "@/components/vendor-totals/VendorTotalCard";
import {loadVendorTotals} from "@/ducks/vendor-totals/actions";

export default function VendorTotals() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedVendorTotals);
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        dispatch(loadVendorTotals(new Date().toISOString()));
    }, []);

    const showHandler = () => {
        setShow(true);
        dispatch(loadVendorTotals(new Date().toISOString()));
    }
    return (
        <>
            <Button variant="info" size="sm" onClick={showHandler}>
                <span className="bi-person-fill me-1" aria-hidden="true"/>
                Contractor Totals
            </Button>
            <Offcanvas show={show} onHide={() => setShow(false)}>
                <Offcanvas.Header closeButton>Active Contractors</Offcanvas.Header>
                <Offcanvas.Body>
                    {list.map((item, i) => (
                        <VendorTotalCard totals={item} key={item.VendorNo}/>
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
