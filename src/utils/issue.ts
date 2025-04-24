import {
    CLIssue,
    CLIssueDetail,
    CLIssueEntry,
    CLIssueEntryDetail,
    CLIssueSearchId,
    CLIssueSearchOptions,
    CLIssueSearchParams,
    CLIssueSearchWorkTicket,
} from "chums-types";

export const isCLIssue = (arg: CLIssue | CLIssueEntry): arg is CLIssue => {
    return !!arg.id && arg.id > 0;
}

export const isCLIssueEntry = (arg: CLIssue | CLIssueEntry): arg is CLIssueEntry => {
    return !arg.id;
}

export const isCLIssueDetail = (arg: CLIssueDetail | CLIssueEntryDetail): arg is CLIssueDetail => {
    return !!arg.id;
}
export const issueDetailKey = (row: CLIssueDetail | CLIssueEntryDetail): string => {
    return isCLIssueDetail(row) ? row.id.toString() : `${row.StepNo}:${row.WorkCenter}:${row.ActivityCode}`;
}

export function isSearchByWorkTicket(options: CLIssueSearchParams): options is CLIssueSearchWorkTicket {
    return (options as CLIssueSearchWorkTicket).workTicketNo !== undefined;
}

export function isSearchById(options: CLIssueSearchParams): options is CLIssueSearchId {
    return (options as CLIssueSearchId).id !== undefined;
}

export function isSearchByOptions(options: CLIssueSearchParams): options is CLIssueSearchOptions {
    return !isSearchById(options) && !isSearchByWorkTicket(options);
}
