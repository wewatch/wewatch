import { createAsyncThunk } from "@reduxjs/toolkit";

import { AccessTokenDTO } from "@wewatch/schemas";
import Request from "common/api";

export const visitorLogin = createAsyncThunk(
  "auth/visitorLogin",
  (visitorId: string) =>
    Request.post<AccessTokenDTO>("/visitors/login", { visitorId }),
);
