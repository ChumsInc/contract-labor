import {fetchJSON} from "@chumsinc/ui-utils";
import {CLVendor} from "chums-types";

export async function fetchVendors(): Promise<CLVendor[]> {
    try {
        const url = '/api/operations/production/contract-labor/vendors.json';
        const res = await fetchJSON<{ vendors: CLVendor[] }>(url, {cache: 'no-cache'});
        return res?.vendors ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchVendors()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVendors()", err);
        return Promise.reject(new Error('Error in fetchVendors()'));
    }
}

export async function postVendor(arg: CLVendor): Promise<CLVendor[]> {
    try {
        const url = '/api/operations/production/contract-labor/vendors.json';
        const res = await fetchJSON<{ vendors: CLVendor[] }>(url, {method: 'POST', body: JSON.stringify(arg)});
        return res?.vendors ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postVendor()", err.message);
            return Promise.reject(err);
        }
        console.debug("postVendor()", err);
        return Promise.reject(new Error('Error in postVendor()'));
    }
}

