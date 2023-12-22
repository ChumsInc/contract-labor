import React, {useState} from 'react';
import VendorTotalsList from "../ducks/vendor-totals/VendorTotalsList";
import CurrentIssueList from "../ducks/issue/CurrentIssueList";
import {FormCheck} from "chums-components";

const EntryContent = () => {
    const [showCosts, setShowCosts] = useState(true);

    return (
        <div>
            <h2>Direct Labor Entry</h2>
            <div className="row g-3">
                <div className="col-6">
                    <VendorTotalsList />
                    <FormCheck type="checkbox" checked={showCosts} onChange={(ev) => setShowCosts(ev.target.checked)} label="Show Costs" />
                    <CurrentIssueList showCosts={showCosts} />
                </div>
                <div className="col-6">

                </div>
            </div>
        </div>
    )
}

export default EntryContent;
