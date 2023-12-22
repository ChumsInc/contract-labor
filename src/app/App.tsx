import React, {useEffect, useState} from 'react';
import AlertList from "../ducks/alerts/AlertList";
import {useAppDispatch} from "./configureStore";
import {loadVendors} from "../ducks/vendors/actions";
import {Tab, TabList} from "chums-components";
import EntryContent from "./EntryContent";
import HistoryContent from "./HistoryContent";
import VendorsContent from "./VendorsContent";
import styled from "@emotion/styled";

const AppContent = styled.div`
    margin-top: 0.5rem;
`

const tabs:Tab[] = [
    {id: 'entry', title: 'Issue/Receive'},
    {id: 'history', title: 'History'},
    {id: 'vendors', title: 'Vendors'}
]
function App() {
    const dispatch = useAppDispatch();
    const [tabId, setTabId] = useState('entry');
    useEffect(() => {
        dispatch(loadVendors());
    }, []);

    return (
        <div>
            <TabList tabs={tabs} currentTabId={tabId} onSelectTab={(t) => setTabId(t.id)}/>
            <AlertList/>
            <AppContent>
                {tabId === 'entry' && <EntryContent />}
                {tabId === 'history' && <HistoryContent />}
                {tabId === 'vendors' && <VendorsContent />}
            </AppContent>
        </div>
    );
}

export default App;
