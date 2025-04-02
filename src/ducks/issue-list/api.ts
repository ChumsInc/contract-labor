import {CLIssue} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchCurrentIssueList(): Promise<CLIssue[]> {
    try {
        const url = '/api/operations/production/contract-labor/issue/current.json'
        const res = await fetchJSON<{ issue: CLIssue[] }>(url, {cache: 'no-cache'});
        return res?.issue ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCurrentIssueList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCurrentIssueList()", err);
        return Promise.reject(new Error('Error in fetchCurrentIssueList()'));
    }
}
