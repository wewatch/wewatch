import { combineReducers } from "@reduxjs/toolkit";

import room from "features/room/slice";

const rootReducer = combineReducers({
  room,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
