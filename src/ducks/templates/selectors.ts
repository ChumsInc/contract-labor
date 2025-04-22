import {RootState} from "@/app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {workTemplateSorter} from "./utils";

export const selectTemplatesLoading = (state:RootState) => state.templates.status;
export const selectTemplatedSearch = (state:RootState) => state.templates.search;
export const selectTemplatesList = (state:RootState) => state.templates.list;
export const selectCurrentTemplate = (state:RootState) => state.templates.current;

export const selectFilteredTemplates = createSelector(
    [selectTemplatesList, selectTemplatedSearch],
    (list, search) => {
        const _search = search.toLowerCase();
        return list.filter(t => t.TemplateNo.toLowerCase().includes(_search))
            .sort(workTemplateSorter);
    }
)
