import { RoomDTO } from "@/schemas/room";

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
  }),

  overrideExisting: false,
});

export default roomApi;
