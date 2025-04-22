import {CLIssueEntry, CLIssueResponse, SearchItem} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {ReceiveCLIssueProps} from "@/ducks/issue-entry/actions";

export async function fetchCLIssue(arg: number): Promise<CLIssueResponse | null> {
    try {
        const url = `/api/operations/production/contract-labor/issue/${encodeURIComponent(arg)}.json`;
        return await fetchJSON<CLIssueResponse>(url, {cache: 'no-cache'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCLIssue()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCLIssue()", err);
        return Promise.reject(new Error('Error in fetchCLIssue()'));
    }
}

export async function postCLIssue(arg: CLIssueEntry): Promise<CLIssueResponse | null> {
    try {
        const url = `/api/operations/production/contract-labor/issue.json`;
        return await fetchJSON<CLIssueResponse>(url, {method: 'POST', body: JSON.stringify(arg)});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}

export async function deleteCLIssue(arg: number): Promise<void> {
    try {
        const url = '/api/operations/production/contract-labor/issue/:id.json'
            .replace(':id', encodeURIComponent(arg));
        await fetchJSON(url, {method: 'DELETE'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteCLIssue()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteCLIssue()", err);
        return Promise.reject(new Error('Error in deleteCLIssue()'));
    }
}

export async function fetchItemLookup(arg: string): Promise<SearchItem | null> {
    try {
        const params = new URLSearchParams({exact: arg});
        const url = `/api/search/item.json?${params.toString()}`;
        const res = await fetchJSON<{ result: SearchItem[] }>(url, {cache: 'no-cache'});
        return res?.result[0] ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemLookup()", err);
        return Promise.reject(new Error('Error in fetchItemLookup()'));
    }
}

export async function postReceiveCLIssue(arg: ReceiveCLIssueProps): Promise<CLIssueResponse> {
    try {
        const url = '/api/operations/production/contract-labor/issue/:id/receive.json'
            .replace(':id', encodeURIComponent(arg.id.toString()));
        const body = JSON.stringify(arg);
        const res = await fetchJSON<CLIssueResponse>(url, {method: 'POST', body});
        if (!res) {
            return {
                issue: null,
                detail: [],
            }
        }
        return res;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postReceiveCLIssue()", err.message);
            return Promise.reject(err);
        }
        console.debug("postReceiveCLIssue()", err);
        return Promise.reject(new Error('Error in postReceiveCLIssue()'));
    }
}

export async function deleteCLReceipt(arg: number | string): Promise<CLIssueResponse> {
    try {
        const url = '/api/operations/production/contract-labor/issue/:id/receive.json'
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<CLIssueResponse>(url, {method: 'DELETE'});
        if (!res) {
            return {
                issue: null,
                detail: [],
            }
        }
        return res;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteCLReceipt()", err.message);
            return Promise.reject(err);
        }
        return Promise.reject(new Error('Error in deleteCLReceipt()'));
    }
}
