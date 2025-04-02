import {CLIssueEntry, CLIssueResponse, SearchItem} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {} from 'chums-types';

export async function fetchCLIssue(arg:number):Promise<CLIssueResponse|null> {
    try {
        const url = `/api/operations/production/contract-labor/issue/${encodeURIComponent(arg)}.json`;
        return await fetchJSON<CLIssueResponse>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchCLIssue()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCLIssue()", err);
        return Promise.reject(new Error('Error in fetchCLIssue()'));
    }
}

export async function postCLIssue(arg:CLIssueEntry):Promise<CLIssueResponse|null> {
    try {
        const url = `/api/operations/production/contract-labor/issue.json`;
        return await fetchJSON<CLIssueResponse>(url, {method: 'POST', body: JSON.stringify(arg)});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}

export async function deleteCLIssue(arg:CLIssueEntry):Promise<void> {
    try {
        const
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteCLIssue()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteCLIssue()", err);
        return Promise.reject(new Error('Error in deleteCLIssue()'));
    }
}

export async function fetchItemLookup(arg:string):Promise<SearchItem|null> {
    try {
        const params = new URLSearchParams({exact: arg});
        const url = `/api/search/item.json?${params.toString()}`;
        const res = await fetchJSON<{result: SearchItem[]}>(url, {cache: 'no-cache'});
        return res?.result[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemLookup()", err);
        return Promise.reject(new Error('Error in fetchItemLookup()'));
    }
}
