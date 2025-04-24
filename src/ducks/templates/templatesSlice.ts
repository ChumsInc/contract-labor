import {WorkTemplate} from "chums-types";
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {loadTemplate, loadTemplates} from "./actions";
import {isStepsList, workTemplateSorter} from "./utils";

const templateKey = (arg: WorkTemplate) => `${arg.TemplateNo}:${arg.RevisionNo}`;

const templatesAdapter = createEntityAdapter<WorkTemplate, string>({
    selectId: (arg) => templateKey(arg),
    sortComparer: (a, b) => templateKey(a).localeCompare(templateKey(b)),
});

const templateSelectors = templatesAdapter.getSelectors();


export interface TemplatesState {
    search: string;
    status: 'idle' | 'loading';
    current: WorkTemplate | null;
}

export const initialTemplatesState: TemplatesState = {
    search: '',
    status: 'idle',
    current: null,
}

const templatesSlice = createSlice({
    name: 'templates',
    initialState: templatesAdapter.getInitialState(initialTemplatesState),
    reducers: {
        setCurrentTemplate: (state, action) => {
            state.current = action.payload;
        },
        setTemplatesSearch: (state, action) => {
            state.search = action.payload;
            const list = templateSelectors.selectAll(state);
            const [current] = list.filter(t => t.TemplateNo === state.search);
            if (current && isStepsList(current.Steps)) {
                state.current = current;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTemplates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadTemplates.fulfilled, (state, action) => {
                state.status = 'idle';
                templatesAdapter.setAll(state, action.payload);
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
                    templatesAdapter.setOne(state, action.payload);
                }
                state.current = action.payload;
            })
            .addCase(loadTemplate.rejected, (state) => {
                state.status = 'idle';
            })
    },
    selectors: {
        selectTemplatesLoading: (state) => state.status,
        selectTemplateSearch: (state) => state.search,
        selectTemplatesList: (state) => templateSelectors.selectAll(state),
        selectCurrentTemplate: (state) => state.current,
    }
});


export const {setCurrentTemplate, setTemplatesSearch} = templatesSlice.actions;
export const {
    selectCurrentTemplate,
    selectTemplateSearch,
    selectTemplatesList,
    selectTemplatesLoading
} = templatesSlice.selectors;

export const selectFilteredTemplates = createSelector(
    [selectTemplatesList, selectTemplateSearch],
    (list, search) => {
        const _search = search.toLowerCase();
        return list.filter(t => t.TemplateNo.toLowerCase().includes(_search))
            .sort(workTemplateSorter);
    }
)

export default templatesSlice;
