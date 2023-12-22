import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsReducer from "../ducks/alerts";
import vendorsReducer from "../ducks/vendors";
import issueReducer from "../ducks/issue";
import vendorsTotalsReducer from "../ducks/vendor-totals";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    issue: issueReducer,
    vendors: vendorsReducer,
    vendorTotals: vendorsTotalsReducer,
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
