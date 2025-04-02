import React from 'react';
import {VendorWeekTotal} from "@/src/types";
import {Card} from "react-bootstrap";
import VendorTotalTable from "@/components/vendor-totals/VendorTotalTable";

export default function VendorTotalCard({totals}: {
    totals: VendorWeekTotal;
}) {
    return (
        <Card className="mb-1">
            <Card.Body>
                <Card.Title>
                    {totals.VendorName}
                </Card.Title>
                <VendorTotalTable totals={totals}/>
            </Card.Body>
        </Card>
    )
}
