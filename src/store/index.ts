import { configureStore } from '@reduxjs/toolkit'

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import globalReducer from './reduer/global'
import userReducer from './reduer/user'

const store = configureStore({
    reducer:{
        global: globalReducer,
        user: userReducer
    }
})

type AppState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store