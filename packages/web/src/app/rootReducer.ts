import { combineReducers } from "@reduxjs/toolkit";

import api from "api";
import room from "features/room/slice";

const rootReducer = combineReducers({
  room,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
