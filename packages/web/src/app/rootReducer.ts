import { combineReducers } from "@reduxjs/toolkit";

import api from "api";
import progress from "features/room/slices/progress";
import room from "features/room/slices/room";

const rootReducer = combineReducers({
  room,
  progress,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
