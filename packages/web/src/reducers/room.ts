import { createReducer } from "@reduxjs/toolkit";

import { createRoom, getRoom } from "actions/room";
import { Room } from "utils/types";

type RoomState = Room | null;

const initialState: RoomState = null;

export default createReducer<RoomState>(initialState, (builder) =>
  builder
    .addCase(createRoom.fulfilled, (state, action) => {
      const { payload } = action;
      return payload;
    })
    .addCase(getRoom.fulfilled, (state, action) => {
      const { payload } = action;
      return payload;
    }),
);
