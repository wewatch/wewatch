import { createAction } from "@reduxjs/toolkit";

import { Notification } from "utils/types";

export const setNotification = createAction<Notification>("notification/set");

export const clearNotification = createAction("notification/clear");
