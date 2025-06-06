import React from 'react';
import EntryContent from "./EntryContent";
import HistoryContent from "@/components/issue-history/HistoryContent";
import VendorsContent from "./VendorsContent";
import {HashRouter, Route, Routes} from "react-router";
import Layout from "./Layout";
import Home from "./Home";
import CLIssueContainer from "@/components/issue-entry/CLIssueContainer";


function App() {

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="entry" element={<EntryContent/>}>
                        <Route index element={<CLIssueContainer />}/>
                        <Route path=":vendor" element={<CLIssueContainer />}>
                            <Route path=":id" element={<CLIssueContainer />}/>
                        </Route>

                    </Route>
                    <Route path="search" element={<HistoryContent/>}/>
                    <Route path="vendors" element={<VendorsContent/>}/>
                    <Route path="*" element={<Home/>}/>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App;
