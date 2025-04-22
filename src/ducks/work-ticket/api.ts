import {PostWorkTicketStatusProps, WorkTicketResponse, WorkTicketWorkStatusItem} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {WorkTicketGroup} from "chums-types";

export async function fetchWorkTicket(arg: string): Promise<WorkTicketResponse | null> {
    try {
        const url = `/api/operations/production/contract-labor/work-ticket/:workTicketNo.json`
            .replace(':workTicketNo', encodeURIComponent(arg));
        return await fetchJSON<WorkTicketResponse>(url, {cache: 'no-cache'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTicket()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTicket()", err);
        return Promise.reject(new Error('Error in fetchWorkTicket()'));
    }
}

export async function fetchWorkTickets(): Promise<WorkTicketWorkStatusItem[]> {
    try {
        const params = new URLSearchParams({loc: 'HUR'})
        const url = `/api/operations/production/work-ticket/status.json?${params.toString()}`;
        const res = await fetchJSON<{ result: WorkTicketWorkStatusItem[] }>(url, {cache: 'no-cache'});
        return res?.result?.filter(row => row.WorkCenters.includes('CON')) ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTickets()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTickets()", err);
        return Promise.reject(new Error('Error in fetchWorkTickets()'));
    }
}

export async function fetchWorkTicketGroups(): Promise<WorkTicketGroup[]> {
    try {
        const url = '/api/operations/production/work-ticket/status/groups.json?loc=HUR';
        const res = await fetchJSON<WorkTicketGroup[]>(url, {cache: 'no-cache'});
        return res ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}

export async function postWorkTicketStatus(arg: PostWorkTicketStatusProps): Promise<WorkTicketWorkStatusItem | null> {
    try {
        const url = '/api/operations/production/work-ticket/status/:workTicketKey/:action.json'
            .replace(':workTicketKey', encodeURIComponent(arg.WorkTicketKey))
            .replace(':action', encodeURIComponent(arg.action));
        const body = JSON.stringify(arg);
        const res = await fetchJSON<{ status: WorkTicketWorkStatusItem | null }>(url, {method: 'POST', body});
        return res?.status ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postWorkTicketStatus()", err.message);
            return Promise.reject(err);
        }
        console.debug("postWorkTicketStatus()", err);
        return Promise.reject(new Error('Error in postWorkTicketStatus()'));
    }
}

