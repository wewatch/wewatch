import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Room } from "@wewatch/schemas";
import Request from "common/api";

type RoomState = Room | null;

const initialState = null as RoomState;

export const createRoom = createAsyncThunk("room/create", () =>
  Request.post<Room>("/rooms"),
);

export const getRoom = createAsyncThunk("room/get", (roomId: string) =>
  Request.get<Room>(`/rooms/${roomId}`),
);

const slice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(createRoom.fulfilled, (state, action) => {
        const { payload } = action;
        return payload;
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        const { payload } = action;
        return payload;
      }),
});

export default slice.reducer;
