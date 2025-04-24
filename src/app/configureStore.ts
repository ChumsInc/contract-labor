import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import vendorsReducer from "../ducks/vendors";
import issueListSlice from "@/ducks/issue-list/issueListSlice";
import vendorTotalsSlice from "@/ducks/vendor-totals/vendorTotalsSlice";
import issueEntrySlice from "@/ducks/issue-entry/issueEntrySlice";
import templatesSlice from "@/ducks/templates/templatesSlice";
import {alertsSlice} from "@chumsinc/alert-list";
import workTicketsListSlice from "@/ducks/work-ticket/workTicketListSlice";
import currentWorkTicketSlice from "@/ducks/work-ticket/currentWorkTicketSlice";
import workTicketIssuesSlice from "@/ducks/work-ticket/workTicketIssuesSlice";
import workStatusGroupSlice from "@/ducks/work-ticket/statusGroupsSlice";
import stepsSlice from "@/ducks/dl-steps/stepsSlice";
import issueHistorySlice from "@/ducks/issue-history";
import vendorsSlice from "../ducks/vendors";

const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [issueEntrySlice.reducerPath]: issueEntrySlice.reducer,
    [templatesSlice.reducerPath]: templatesSlice.reducer,
    [vendorsSlice.reducerPath]: vendorsSlice.reducer,
    [issueListSlice.reducerPath]: issueListSlice.reducer,
    [stepsSlice.reducerPath]: stepsSlice.reducer,
    [currentWorkTicketSlice.reducerPath]: currentWorkTicketSlice.reducer,
    [workTicketsListSlice.reducerPath]: workTicketsListSlice.reducer,
    [workTicketIssuesSlice.reducerPath]: workTicketIssuesSlice.reducer,
    [workStatusGroupSlice.reducerPath]: workStatusGroupSlice.reducer,
    [vendorTotalsSlice.reducerPath]: vendorTotalsSlice.reducer,
    [issueHistorySlice.reducerPath]: issueHistorySlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error']
        }
    })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
