import { createReducer } from "@reduxjs/toolkit";

import type { Room } from "@wewatch/schemas";
import { createRoom, getRoom } from "actions/room";

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
