import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Room } from "@wewatch/schemas";

import { addVideoToPlaylist, deleteVideoFromPlaylist, getRoom } from "./action";

export interface RoomState {
  activePlaylistId: string;
}

interface RoomSliceState {
  data: Room;
  state: RoomState;
}

const initialState: RoomSliceState = {
  data: {
    id: "",
    playlists: [],
  },
  state: {
    activePlaylistId: "",
  },
};

const slice = createSlice({
  name: "room",
  initialState,

  reducers: {
    setActivePlaylistId(state, action: PayloadAction<string>) {
      state.state.activePlaylistId = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getRoom.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        const { roomId, playlistId, video } = action.meta.arg;
        const room = state.data;
        const playlist = room.playlists.find((p) => p.id === playlistId);
        if (room.id === roomId && playlist !== undefined) {
          playlist.videos.push({ ...video, ...action.payload });
        }
      })
      .addCase(deleteVideoFromPlaylist.fulfilled, (state, action) => {
        const { roomId, playlistId, videoId } = action.meta.arg;
        const room = state.data;
        const playlist = room.playlists.find((p) => p.id === playlistId);
        if (room.id === roomId && playlist !== undefined) {
          playlist.videos = playlist.videos.filter((v) => v.id !== videoId);
        }
      }),
});

export { getRoom, addVideoToPlaylist, deleteVideoFromPlaylist };
export const { setActivePlaylistId } = slice.actions;
export default slice.reducer;
