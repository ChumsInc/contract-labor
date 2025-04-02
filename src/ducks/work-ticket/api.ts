import {WorkTicketResponse, WorkTicketWorkStatusGroup, WorkTicketWorkStatusItem} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchWorkTicket(arg:string):Promise<WorkTicketResponse|null> {
    try {
        const url = `/api/operations/production/contract-labor/work-ticket/:workTicketNo.json`
            .replace(':workTicketNo', encodeURIComponent(arg));
        return await fetchJSON<WorkTicketResponse>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTicket()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTicket()", err);
        return Promise.reject(new Error('Error in fetchWorkTicket()'));
    }
}

export async function fetchWorkTickets():Promise<WorkTicketWorkStatusItem[]> {
    try {
        const params = new URLSearchParams({loc: 'HUR'})
        const url = `/api/operations/production/work-ticket/status.json?${params.toString()}`;
        const res = await fetchJSON<{result: WorkTicketWorkStatusItem[]}>(url, {cache: 'no-cache'});
        return res?.result?.filter(row => row.WorkCenters.includes('CON')) ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTickets()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTickets()", err);
        return Promise.reject(new Error('Error in fetchWorkTickets()'));
    }
}

export async function fetchWorkTicketGroups():Promise<WorkTicketWorkStatusGroup[]> {
    try {
        const url = '/api/operations/production/work-ticket/status/groups.json?loc=HUR';
        const res = await fetchJSON<WorkTicketWorkStatusGroup[]>(url, {cache: 'no-cache'});
        return res ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}
