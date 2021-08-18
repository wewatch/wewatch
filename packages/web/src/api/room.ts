import { MemberDTO } from "@/schemas/member";
import { RoomDTO } from "@/schemas/room";
import { SearchDTO, SearchVideoResultDTO } from "@/schemas/search";

import api from "./index";

const roomApi = api.injectEndpoints({
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

    getRoomMembers: builder.query<MemberDTO[], string>({
      query: (roomId) => `/rooms/${roomId}/members`,
    }),

    searchVideo: builder.mutation<SearchVideoResultDTO, SearchDTO>({
      query: (searchQuery) => ({
        url: "/search",
        method: "POST",
        body: searchQuery,
      }),
    }),
  }),

  overrideExisting: false,
});

export default roomApi;
