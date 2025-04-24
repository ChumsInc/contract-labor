import {createAsyncThunk} from "@reduxjs/toolkit";
import {WorkTicketResponse, WorkTicketWorkStatusItem} from "chums-types";
import {fetchWorkTicket, fetchWorkTicketGroups, fetchWorkTickets, postWorkTicketStatus} from "./api";

import {RootState} from "@/app/configureStore";
import {selectWorkTicketStatus} from "@/ducks/work-ticket/currentWorkTicketSlice";
import {selectWTListStatus} from "@/ducks/work-ticket/workTicketListSlice";
import {selectStatusGroupsLoading} from "@/ducks/work-ticket/statusGroupsSlice";
import {WorkTicketGroup} from "chums-types";
import {PostWorkTicketStatusProps} from "@/src/types";

export const setCurrentWorkTicket = createAsyncThunk<WorkTicketResponse | null, string>(
    'work-ticket/load',
    async (arg) => {
        return await fetchWorkTicket(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectWorkTicketStatus(state) === 'idle';
        }
    }
)

export const loadWorkTicketStatusList = createAsyncThunk<WorkTicketWorkStatusItem[]>(
    'work-ticket/status/load',
    async () => {
        return await fetchWorkTickets();
    },
    {
        condition: (_arg, {getState}) => {
            const state = getState() as RootState;
            return selectWTListStatus(state) === 'idle';
        }
    }
)

export const loadWorkTicketStatusGroups = createAsyncThunk<WorkTicketGroup[]>(
    'work-ticket/groups/load',
    async () => {
        return await fetchWorkTicketGroups();
    },
    {
        condition: (_arg, {getState}) => {
            const state = getState() as RootState;
            return selectStatusGroupsLoading(state) === 'idle';
        }
    }
)

export const setWorkTicketStatus = createAsyncThunk<WorkTicketWorkStatusItem | null, PostWorkTicketStatusProps, {
    state: RootState
}>(
    'work-ticket/setWorkTicketStatus',
    async (arg) => {
        return await postWorkTicketStatus(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectWTListStatus(state) === 'idle';
        }
    }
)
