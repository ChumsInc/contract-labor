import React from 'react';
import {Route, RouterProvider, Routes} from 'react-router-dom'
import Layout from "./Layout";
import EntryContent from "./EntryContent";
import VendorsContent from "./VendorsContent";
import HistoryContent from "./HistoryContent";

export default function Root() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/entry" element={<EntryContent />} />
                <Route path="/history" element={<HistoryContent />} />
                <Route path="/vendors" element={<VendorsContent />} />
            </Route>
        </Routes>
    )
}
