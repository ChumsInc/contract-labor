import React from 'react';
import EntryContent from "./EntryContent";
import HistoryContent from "./HistoryContent";
import VendorsContent from "./VendorsContent";
import './app.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import CurrentIssueList from "@/components/issue-list/CurrentIssueList";
import CLIssueContent from "@/components/CLIssueContent";
import NoVendorContent from "./NoVendorContent";


function App() {

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home />} />
                    <Route path="entry" element={<EntryContent/>}>
                        <Route index element={<CLIssueContent />} />
                        <Route path=":vendor" element={<CLIssueContent />} />
                    </Route>
                    <Route path="search" element={<HistoryContent/>}/>
                    <Route path="vendors" element={<VendorsContent/>}/>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App;
