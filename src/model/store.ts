import {configureStore} from '@reduxjs/toolkit'
import {messagesReducer} from "../model/messagesSlice";
import {userReducer} from "../model/userSlice";
import {useDispatch} from "react-redux";

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()