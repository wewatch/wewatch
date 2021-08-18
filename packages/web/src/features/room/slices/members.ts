import { createSlice } from "@reduxjs/toolkit";

import { memberActions as actions } from "@/actions/member";
import { MemberDTO } from "@/schemas/member";

// Map userId => member
export type MembersState = Record<string, MemberDTO>;

const initialState: MembersState = {};

const slice = createSlice({
  name: "members",
  initialState,

  reducers: {},

  extraReducers: (builder) =>
    builder
      .addCase(actions.wrappedJoinRoom, (state, action) => {
        const { userId, ...user } = action.payload;
        state[userId] = {
          user,
          online: true,
        };
      })
      .addCase(actions.wrappedLeaveRoom, (state, action) => {
        const { userId } = action.payload;
        if (userId in state) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state[userId]!.online = false;
        }
      }),
});

export default slice.reducer;
