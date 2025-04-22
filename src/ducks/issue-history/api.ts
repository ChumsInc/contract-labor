import {CLIssue, IssueSearchParams} from "../../types";
import {isSearchById, isSearchByWorkTicket} from "@/utils/issue";
import {fetchJSON} from "@chumsinc/ui-utils";

function parseSearchParams(arg: IssueSearchParams): URLSearchParams {
    const params = new URLSearchParams();
    if (isSearchById(arg)) {
        params.set('id', arg.id.toString());
        return params;
    }
    if (isSearchByWorkTicket(arg)) {
        params.set('workTicketNo', arg.workTicketNo);
        return params;
    }
    params.set('dateType', arg.dateType);
    params.set('minDate', arg.minDate);
    params.set('maxDate', arg.maxDate);
    if (arg.activityCode) {
        params.set('activityCode', arg.activityCode);
    }
    if (arg.itemCode) {
        params.set('itemCode', arg.itemCode);
    }
    if (arg.templateNo) {
        params.set('templateNo', arg.templateNo);
    }
    if (arg.vendorNo) {
        params.set('vendorNo', arg.vendorNo);
    }
    if (arg.warehouseCode) {
        params.set('warehouseCode', arg.warehouseCode)
    }
    return params;
}

export async function fetchIssueSearch(arg: IssueSearchParams): Promise<CLIssue[]> {
    try {
        const params = parseSearchParams(arg);
        const url = `/api/operations/production/contract-labor/issue/search.json?${params.toString()}`
        const res = await fetchJSON<CLIssue[]>(url, {cache: 'no-cache'});
        return res ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchIssueSearch()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchIssueSearch()", err);
        return Promise.reject(new Error('Error in fetchIssueSearch()'));
    }
}

