import {WorkTemplate} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchTemplates():Promise<WorkTemplate[]> {
    try {
        const url = `/api/operations/production/pm/templates.json?workCenter=CON`;
        const res = await fetchJSON<{templates: WorkTemplate[]}>(url);
        return res?.templates ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTemplates()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTemplates()", err);
        return Promise.reject(new Error('Error in fetchTemplates()'));
    }
}

export async function fetchTemplate(arg: string):Promise<WorkTemplate|null> {
    try {
        const url = `/api/operations/production/pm/templates/:templateNo.json?workCenter=CON`
            .replace(':templateNo', encodeURIComponent(arg));
        const res = await fetchJSON<{template: WorkTemplate|null}>(url);
        return res?.template ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTemplates()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTemplates()", err);
        return Promise.reject(new Error('Error in fetchTemplates()'));
    }

}
