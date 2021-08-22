import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { WrappedMemberActionDTO } from "@/actions/member";
import { WrappedRoomActionDTO } from "@/actions/room";

export type Activity = WrappedRoomActionDTO | WrappedMemberActionDTO;
export type Activities = Activity[];

const initialState: Activities = [];

const slice = createSlice({
  name: "activities",
  initialState,

  reducers: {
    addActivity(state, action: PayloadAction<Activity>) {
      state.unshift(action.payload);
    },
  },
});

export const { addActivity } = slice.actions;
export default slice.reducer;
