import {Vendor, VendorWeekTotal} from "../../types";
import {fetchJSON} from "chums-components";
import dayjs from "dayjs";

export async function fetchVendors():Promise<Vendor[]> {
    try {
        const url = '/api/operations/production/contract-labor/vendors/chums';
        const res = await fetchJSON<{result: Vendor[]}>(url, {cache: 'no-cache'});
        return res?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVendors()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVendors()", err);
        return Promise.reject(new Error('Error in fetchVendors()'));
    }
}

export async function postVendor(arg:Vendor):Promise<Vendor[]> {
    try {
        const url = '/api/operations/production/contract-labor/vendors/chums';
        const res = await fetchJSON<{result: Vendor[]}>(url, {method: 'POST', body: JSON.stringify(arg)});
        return res?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postVendor()", err.message);
            return Promise.reject(err);
        }
        console.debug("postVendor()", err);
        return Promise.reject(new Error('Error in postVendor()'));
    }
}

