import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { StorageKey } from "common/enums";
import { storage } from "common/utils";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const accessToken = storage.getItem(StorageKey.AccessToken);
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
});

export default api;
