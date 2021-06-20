import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AccessTokenDTO, RoomDTO, UserInfoDTO } from "@wewatch/schemas";
import type { RootState } from "app/rootReducer";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).auth;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfoDTO, null>({
      query: () => "/users/me",
    }),

    visitorLogin: builder.mutation<AccessTokenDTO, string>({
      query: (visitorId) => ({
        url: "/visitors/login",
        method: "POST",
        body: { visitorId },
      }),
    }),

    createRoom: builder.mutation<RoomDTO, null>({
      query: () => ({
        url: "/rooms",
        method: "POST",
      }),
    }),

    getRoom: builder.query<RoomDTO, string>({
      query: (roomId) => `/rooms/${roomId}`,
    }),
  }),
});

export const { useGetRoomQuery, useCreateRoomMutation } = api;
export default api;
