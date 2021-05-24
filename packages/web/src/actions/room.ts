import { createAsyncThunk } from "@reduxjs/toolkit";

import type { Room } from "@wewatch/schemas";
import Request from "utils/api";

export const createRoom = createAsyncThunk("room/create", () =>
  Request.post<Room>("/rooms"),
);

export const getRoom = createAsyncThunk("room/get", (roomId: string) =>
  Request.get<Room>(`/rooms/${roomId}`),
);
