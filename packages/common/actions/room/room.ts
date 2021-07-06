import { createAction } from "@reduxjs/toolkit";
import * as yup from "yup";

import { VideoDTO, videoSchema } from "@/schemas/room";
import { withSchema } from "@/schemas/utils";

// addVideo

export const addVideoPayloadSchema = yup.object({
  playlistId: yup.string().required(),
  video: videoSchema,
});

@withSchema(addVideoPayloadSchema)
export class AddVideoPayload {
  playlistId!: string;
  video!: VideoDTO;
}

export const addVideo = createAction<AddVideoPayload>("room/addVideo");

// deleteVideo

export const deleteVideoPayloadSchema = yup.object({
  playlistId: yup.string().required(),
  videoId: yup.string().required(),
});

@withSchema(deleteVideoPayloadSchema)
export class DeleteVideoPayload {
  playlistId!: string;
  videoId!: string;
}

export const deleteVideo = createAction<DeleteVideoPayload>("room/deleteVideo");

// setPlaying

export const setPlayingPayloadSchema = yup.boolean().required();

export const setPlaying = createAction<boolean>("room/setPlaying");

// setActiveURL

export const setActiveURLPayloadSchema = yup.object({
  playlistId: yup.string().required(),
  url: yup.string().url().required(),
});

@withSchema(setActiveURLPayloadSchema)
export class SetActiveURLPayload {
  playlistId!: string;
  url!: string;
}

export const setActiveURL =
  createAction<SetActiveURLPayload>("room/setActiveURL");
