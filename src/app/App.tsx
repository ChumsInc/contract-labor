import React from 'react';
import EntryContent from "./EntryContent";
import HistoryContent from "./HistoryContent";
import VendorsContent from "./VendorsContent";
// import './app.css';
import {BrowserRouter, HashRouter, Route, Routes} from "react-router";
import Layout from "./Layout";
import Home from "./Home";
import CLIssueContent from "@/components/CLIssueContent";


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="entry" element={<EntryContent/>}>
                        <Route index element={<CLIssueContent/>}/>
                        <Route path=":vendor" element={<CLIssueContent/>}/>
                    </Route>
                    <Route path="search" element={<HistoryContent/>}/>
                    <Route path="vendors" element={<VendorsContent/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
