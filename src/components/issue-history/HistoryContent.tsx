import React from 'react';
import IssueHistoryList from "@/components/issue-history/IssueHistoryList";
import IssueHistoryActionBar from "@/components/issue-history/IssueHistoryActionBar";

const HistoryContent = () => {

    return (
        <div>
            <IssueHistoryActionBar/>
            <IssueHistoryList/>
        </div>
    )
}

export default HistoryContent;
