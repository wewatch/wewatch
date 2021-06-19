import { createAsyncThunk } from "@reduxjs/toolkit";

import { Room } from "@wewatch/schemas";
import Request from "common/api";

export const getRoom = createAsyncThunk("room/get", (roomId: string) =>
  Request.get<Room>(`/rooms/${roomId}`),
);
