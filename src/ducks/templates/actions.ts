import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchTemplate, fetchTemplates} from "./api";
import {WorkTemplate} from "chums-types";
import {RootState} from "@/app/configureStore";
import {selectTemplatesLoading} from "./selectors";

export const setTemplatesSearch = createAction<string>('templates/setSearch');
export const loadTemplates = createAsyncThunk<WorkTemplate[],void>(
    'templates/loadList',
    async () => {
        return await fetchTemplates();
    },
    {
        condition: (_arg, {getState}) => {
            const state = getState() as RootState;
            return selectTemplatesLoading(state) === 'idle';
        }
    }
)

export const loadTemplate = createAsyncThunk<WorkTemplate|null, string>(
    'templates/loadTemplate',
    async (arg) => {
        return await fetchTemplate(arg);
    },
    {
        condition: (_arg, {getState}) => {
            const state = getState() as RootState;
            return selectTemplatesLoading(state) === 'idle';
        }
    }
)

export const setCurrentTemplate = createAction<WorkTemplate|null>('templates/setCurrent')
