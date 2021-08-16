import { createAction } from "@reduxjs/toolkit";

import { UserInfoDTO, userInfoSchema } from "@/schemas/user";
import { withSchema } from "@/schemas/utils";

// joinRoom

export const joinRoomPayloadSchema = userInfoSchema;

@withSchema(joinRoomPayloadSchema)
export class JoinRoomPayload extends UserInfoDTO {}

export const joinRoom = createAction<JoinRoomPayload>("member/joinRoom");

// leaveRoom

export const leaveRoom = createAction<void>("member/leaveRoom");

// readyToNext

export const readyToNext = createAction<void>("member/readyToNext");
