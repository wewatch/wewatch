import { createSlice } from "@reduxjs/toolkit";

import { roomActions as actions } from "@/actions/room";
import type { Room } from "@/schemas/room";
import roomApi from "api/room";

const initialState: Room = {
  id: "",
  playlists: [],
  playerState: {
    url: null,
    activePlaylistId: null,
    playing: false,
  },
};

const slice = createSlice({
  name: "room",
  initialState,

  reducers: {},

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
      .addCase(actions.updateVideo, (state, action) => {
        const { playlistId, videoId, rank } = action.payload;
        const playlist = state.playlists.find((p) => p.id === playlistId);
        if (playlist !== undefined) {
          const video = playlist.videos.find((v) => v.id === videoId);
          if (video) {
            video.rank = rank;
          }
        }
      })
      .addCase(actions.setPlaying, (state, action) => {
        state.playerState.playing = action.payload;
      })
      .addCase(actions.setActiveURL, (state, action) => {
        const { url, playlistId } = action.payload;
        if (url === state.playerState.url) {
          return;
        }

        state.playerState.url = url;
        state.playerState.activePlaylistId = playlistId;
        state.playerState.playing = true;
      })
      .addMatcher(
        roomApi.endpoints.getRoom.matchFulfilled,
        (state, action) => action.payload,
      ),
});

export default slice.reducer;
