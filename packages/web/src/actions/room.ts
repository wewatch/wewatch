import { createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";
import { Room } from "utils/types";

export const createRoom = createAsyncThunk("room/create", () =>
  Request.post<Room>("/rooms"),
);

export const getRoom = createAsyncThunk("room/get", (roomId: string) =>
  Request.get<Room>(`/rooms/${roomId}`),
);
