import {WorkTemplate} from "chums-types";
import {createEntityAdapter, createReducer} from "@reduxjs/toolkit";
import {loadTemplate, loadTemplates, setCurrentTemplate, setTemplatesSearch} from "./actions";
import {isStepsList, workTemplateSorter} from "./utils";

const templateKey = (arg:WorkTemplate) => `${arg.TemplateNo}:${arg.RevisionNo}`;

const templatesAdapter = createEntityAdapter<WorkTemplate, string>({
    selectId: (arg) => templateKey(arg),
    sortComparer: (a,b) => templateKey(a).localeCompare(templateKey(b)),
});

const templateSelectors = templatesAdapter.getSelectors();


export interface TemplatesState {
    list: WorkTemplate[];
    search: string;
    status: 'idle'|'loading';
    current: WorkTemplate|null;
}

export const initialTemplatesState:TemplatesState = {
    list: [],
    search: '',
    status: 'idle',
    current: null,
}

const templatesReducer = createReducer(initialTemplatesState, builder =>  {
    builder
        .addCase(loadTemplates.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadTemplates.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = action.payload.sort(workTemplateSorter);
        })
        .addCase(loadTemplates.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(loadTemplate.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadTemplate.fulfilled, (state, action) => {
            state.status = 'idle';
            if (action.payload) {
                state.list = [
                    ...state.list.filter(t => t.TemplateNo !== action.meta.arg),
                    action.payload,
                ].sort(workTemplateSorter);
            }
            state.current = action.payload;
        })
        .addCase(loadTemplate.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(setTemplatesSearch, (state, action) => {
            state.search = action.payload;
            const [current] = state.list.filter(t => t.TemplateNo === state.search);
            if (current && isStepsList(current.Steps)) {
                state.current = current;
            }
        })
        .addCase(setCurrentTemplate, (state, action) => {
            state.current = action.payload;
        })
});

export default templatesReducer;
