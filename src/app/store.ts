import { configureStore } from "@reduxjs/toolkit"
import gameReducer from "./gameSlice"

const store = configureStore({
  reducer: {
    gameReducer
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type User = {username: string, score: number}