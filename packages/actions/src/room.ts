import { createAction } from "@reduxjs/toolkit";

import { VideoDTO, videoSchema, withSchema } from "@wewatch/schemas";
import * as yup from "yup";

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
