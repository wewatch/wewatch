import { createAction } from "@reduxjs/toolkit";
import * as yup from "yup";

import { UserInfoDTO, userInfoSchema } from "@/schemas/user";
import { withSchema } from "@/schemas/utils";

type WrappedPayload = {
  userId: string;
};

// joinRoom

export const joinRoomPayloadSchema = userInfoSchema;

@withSchema(joinRoomPayloadSchema)
export class JoinRoomPayload extends UserInfoDTO {}

export const joinRoom = createAction<JoinRoomPayload>("member/joinRoom");

type WrappedJoinRoomPayload = WrappedPayload &
  yup.Asserts<typeof joinRoomPayloadSchema>;

export const wrappedJoinRoom = createAction<WrappedJoinRoomPayload>(
  joinRoom.type,
);

// leaveRoom

export const leaveRoom = createAction<void>("member/leaveRoom");

type WrappedLeaveRoomPayload = WrappedPayload;
export const wrappedLeaveRoom = createAction<WrappedLeaveRoomPayload>(
  leaveRoom.type,
);

// readyToNext

export const readyToNext = createAction<void>("member/readyToNext");
