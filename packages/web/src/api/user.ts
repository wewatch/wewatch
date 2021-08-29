import { UpdateUserInfoDTO, UserInfoDTO } from "@/schemas/user";

import api from "./index";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfoDTO, void>({
      query: () => "/users/me",
    }),

    updateUserInfo: builder.mutation<UserInfoDTO, UpdateUserInfoDTO>({
      query: (payload) => ({
        url: "/users/me",
        method: "PUT",
        body: payload,
      }),
    }),
  }),

  overrideExisting: false,
});

export default userApi;
