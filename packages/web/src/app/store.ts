import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import api from "api";
import { setProgress } from "features/room/slices/progress";

import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: {
    actionsBlacklist: [setProgress.toString()],
  },
});

setupListeners(store.dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
