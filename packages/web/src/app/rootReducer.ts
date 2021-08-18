import { combineReducers } from "@reduxjs/toolkit";

import api from "api";
import roomSlices from "features/room/slices";

const rootReducer = combineReducers({
  ...roomSlices,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
