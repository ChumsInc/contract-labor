import {VendorWeekTotal} from "../../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchVendorTotals(arg:string,):Promise<VendorWeekTotal[]> {
    try {
        const url = '/api/operations/production/contract-labor/vendors/totals.json';
        const res = await fetchJSON<{totals: VendorWeekTotal[]}>(url, {cache: 'no-cache'});
        return res?.totals ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVendorTotals()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVendorTotals()", err);
        return Promise.reject(new Error('Error in fetchVendorTotals()'));
    }
}

