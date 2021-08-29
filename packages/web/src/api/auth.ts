import { AccessTokenDTO } from "@/schemas/user";

import api from "./index";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    visitorLogin: builder.mutation<AccessTokenDTO, string>({
      query: (visitorId) => ({
        url: "/visitors/login",
        method: "POST",
        body: { visitorId },
      }),
    }),
  }),

  overrideExisting: false,
});

export default authApi;
