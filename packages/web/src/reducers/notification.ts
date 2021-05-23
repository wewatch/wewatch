import { createReducer } from "@reduxjs/toolkit";

import { clearNotification, setNotification } from "actions/notification";
import { Notification } from "utils/types";

export type NotificationState = Notification | null;

const initialState: NotificationState = null;

export default createReducer<NotificationState>(initialState, (builder) =>
  builder
    .addCase(setNotification, (state, action) => {
      const { payload } = action;
      return payload;
    })
    .addCase(clearNotification, () => null),
);
