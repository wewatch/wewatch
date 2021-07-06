import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { roomActions as actions } from "@/actions/room";
import type { Room } from "@/schemas/room";

const initialState: Room = {
  id: "",
  playlists: [],
  activePlaylistId: null,
  playerState: {
    url: null,
    playing: false,
  },
};

const slice = createSlice({
  name: "room",
  initialState,

  reducers: {
    setRoom(state, action: PayloadAction<Room>) {
      return action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
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
      })
      .addCase(actions.setPlaying, (state, action) => {
        state.playerState.playing = action.payload;
      })
      .addCase(actions.setActiveURL, (state, action) => {
        const newActiveURL = action.payload;
        if (newActiveURL === state.playerState.url) {
          return;
        }

        state.playerState.url = newActiveURL;
        state.playerState.playing = true;
      }),
});

export const { setRoom } = slice.actions;
export default slice.reducer;
