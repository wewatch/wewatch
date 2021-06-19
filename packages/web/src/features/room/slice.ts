import { createSlice } from "@reduxjs/toolkit";

import { roomActions as actions } from "@wewatch/actions";
import type { Room } from "@wewatch/schemas";

import { getRoom } from "./action";

const initialState: Room = {
  id: "",
  playlists: [],
  activePlaylistId: null,
  activeVideoURL: null,
};

const slice = createSlice({
  name: "room",
  initialState,
  reducers: {},

  extraReducers: (builder) =>
    builder
      .addCase(getRoom.fulfilled, (state, action) => action.payload)
      .addCase(actions.addVideo, (state, action) => {
        const { playlistId, video } = action.payload;
        const playlist = state.playlists.find((p) => p.id === playlistId);
        if (playlist !== undefined) {
          playlist.videos.push(video);
        }
      })
      .addCase(actions.deleteVideo, (state, action) => {
        const { playlistId, videoId } = action.payload;
        const playlist = state.playlists.find((p) => p.id === playlistId);
        if (playlist !== undefined) {
          playlist.videos = playlist.videos.filter((v) => v.id !== videoId);
        }
      }),
});

export { getRoom };
export default slice.reducer;
