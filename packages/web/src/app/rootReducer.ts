import { combineReducers } from "@reduxjs/toolkit";

import api from "api";
import auth from "features/auth/slice";
import room from "features/room/slice";

const rootReducer = combineReducers({
  auth,
  room,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
