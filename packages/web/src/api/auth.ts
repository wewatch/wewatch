import { AccessTokenDTO, UserInfoDTO } from "@wewatch/common/schemas/user";

import api from "./index";

const authApi = api.injectEndpoints({
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
  }),

  overrideExisting: false,
});

export default authApi;
