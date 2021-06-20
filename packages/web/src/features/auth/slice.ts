import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserInfoDTO } from "@wewatch/schemas";
import api from "api";

interface AuthState {
  accessToken?: string;
  visitorId: string;
  user: UserInfoDTO | null;
}

const initialState: AuthState = {
  accessToken: undefined,
  visitorId: "",
  user: null,
};

const slice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setVisitorId(state, action: PayloadAction<string>) {
      state.visitorId = action.payload;
    },

    setAccessToken(state, action: PayloadAction<string | undefined>) {
      state.accessToken = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
      .addMatcher(api.endpoints.getUserInfo.matchFulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(
        api.endpoints.visitorLogin.matchFulfilled,
        (state, action) => {
          state.accessToken = action.payload.accessToken;
        },
      ),
});

export const { setVisitorId, setAccessToken } = slice.actions;
export default slice.reducer;