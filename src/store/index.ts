import { configureStore } from '@reduxjs/toolkit'

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import globalReducer from './reduer/global'
import userReducer from './reduer/user'
import resourceReducer from './reduer/resource'
import editorReducer from './reduer/editor'
import memoReducer from './reduer/memo'
import filterReducer from './reduer/filter'
import tagReducer from './reduer/tag'
import shortcutReducer from './reduer/shortcut'
import layoutReducer from './reduer/layout'
import dialogReducer from './reduer/dialog'

const store = configureStore({
    reducer:{
        global: globalReducer,
        user: userReducer,
        resource: resourceReducer,
        editor: editorReducer,
        memo:memoReducer,
        filter: filterReducer,
        tag:tagReducer,
        shortcut:shortcutReducer,
        layout:layoutReducer,
        dialog: dialogReducer
    }
})

type AppState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store