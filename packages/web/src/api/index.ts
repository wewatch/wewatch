import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RoomDTO } from "@wewatch/schemas";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),

  endpoints: (builder) => ({
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
