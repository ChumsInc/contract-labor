import {
    CLIssue,
    CLIssueDetail,
    CLIssueEntry,
    CLIssueEntryDetail,
    IssueSearchId,
    IssueSearchOptions,
    IssueSearchParams,
    IssueSearchWorkTicket
} from "../types";

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

export function isSearchByWorkTicket(options: IssueSearchParams): options is IssueSearchWorkTicket {
    return (options as IssueSearchWorkTicket).workTicketNo !== undefined;
}

export function isSearchById(options: IssueSearchParams): options is IssueSearchId {
    return (options as IssueSearchId).id !== undefined;
}

export function isSearchByOptions(options: IssueSearchParams): options is IssueSearchOptions {
    return !isSearchById(options) && !isSearchByWorkTicket(options);
}
