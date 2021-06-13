import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  AddVideoToPlayList,
  CreationResultDTO,
  DeleteVideoFromPlaylist,
  EmptyObject,
  Room,
} from "@wewatch/schemas";
import Request from "common/api";

export const getRoom = createAsyncThunk("room/get", (roomId: string) =>
  Request.get<Room>(`/rooms/${roomId}`),
);

export const addVideoToPlaylist = createAsyncThunk(
  "room/addVideo",
  ({ roomId, playlistId, video }: AddVideoToPlayList) =>
    Request.post<CreationResultDTO>(
      `/rooms/${roomId}/playlists/${playlistId}/videos`,
      video,
    ),
);

export const deleteVideoFromPlaylist = createAsyncThunk(
  "room/deleteVideo",
  ({ roomId, playlistId, videoId }: DeleteVideoFromPlaylist) =>
    Request.delete<EmptyObject>(
      `/rooms/${roomId}/playlists/${playlistId}/videos/${videoId}`,
    ),
);
