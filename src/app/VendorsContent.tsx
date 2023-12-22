import React from 'react';
import VendorList from "../ducks/vendors/VendorList";
import VendorEditor from "../ducks/vendors/VendorEditor";

const VendorsContent = () => {

    return (
        <div>
            <h2>C/L Vendor Maintenance</h2>
            <div className="row g-3">
                <div className="col-6">
                    <VendorList />
                </div>
                <div className="col-6">
                    <VendorEditor />
                </div>
            </div>
        </div>
    )
}

export default VendorsContent;
