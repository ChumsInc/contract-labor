import {DLStep} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchCLSteps():Promise<DLStep[]> {
    try {
        const url = '/api/operations/production/dl/steps.json';
        const res = await fetchJSON<{steps:DLStep[]}>(url, {cache: 'no-cache'});
        return (res?.steps ?? []).filter(s => s.workCenter === 'CON');
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchCLSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCLSteps()", err);
        return Promise.reject(new Error('Error in fetchCLSteps()'));
    }
}
