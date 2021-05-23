import { combineReducers } from "@reduxjs/toolkit";

import notification from "./notification";
import room from "./room";

const rootReducer = combineReducers({
  notification,
  room,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
