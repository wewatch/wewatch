import { combineReducers } from "@reduxjs/toolkit";

import api from "api";
import auth from "features/auth/slice";
import progress from "features/room/slices/progress";
import room from "features/room/slices/room";

const rootReducer = combineReducers({
  auth,
  room,
  progress,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
