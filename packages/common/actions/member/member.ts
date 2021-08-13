import { createAction } from "@reduxjs/toolkit";

export const joinRoom = createAction<void>("member/joinRoom");

export const leaveRoom = createAction<void>("member/leaveRoom");

export const readyToNext = createAction<void>("member/readyToNext");
