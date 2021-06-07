import { combineReducers } from "@reduxjs/toolkit";

import room from "./room";

const rootReducer = combineReducers({
  room,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
