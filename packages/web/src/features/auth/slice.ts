import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { visitorLogin } from "./action";

interface AuthState {
  accessToken?: string;
  visitorId: string;
}

const initialState: AuthState = {
  accessToken: undefined,
  visitorId: "",
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
    builder.addCase(visitorLogin.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
    }),
});

export const { setVisitorId, setAccessToken } = slice.actions;
export default slice.reducer;
