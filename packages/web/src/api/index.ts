import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AppState } from "app/store";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as AppState).auth;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
});

export default api;
