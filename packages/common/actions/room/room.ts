import { createAction } from "@reduxjs/toolkit";
import * as yup from "yup";

import { rankSchema, VideoDTO, videoSchema } from "@/schemas/room";
import { withSchema } from "@/schemas/utils";

// common

const videoIdSchema = yup.object({
  playlistId: yup.string().required(),
  videoId: yup.string().required(),
  title: yup.string().required(),
});

class VideoId {
  playlistId!: string;
  videoId!: string;
  title!: string;
}

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

export const deleteVideoPayloadSchema = videoIdSchema;

@withSchema(deleteVideoPayloadSchema)
export class DeleteVideoPayload extends VideoId {}

export const deleteVideo = createAction<DeleteVideoPayload>("room/deleteVideo");

// updateVideo

export const updateVideoPayloadSchema = videoIdSchema.concat(rankSchema);

@withSchema(updateVideoPayloadSchema)
export class UpdateVideoPayload extends VideoId {
  rank!: string;
}

export const updateVideo = createAction<UpdateVideoPayload>("room/updateVideo");

// setPlaying

export const setPlayingPayloadSchema = yup.boolean().required();

export const setPlaying = createAction<boolean>("room/setPlaying");

// setActiveURL

export const setActiveURLPayloadSchema = yup.object({
  playlistId: yup.string().required(),
  url: yup.string().url().required(),
  title: yup.string().required(),
});

@withSchema(setActiveURLPayloadSchema)
export class SetActiveURLPayload {
  playlistId!: string;
  url!: string;
  title!: string;
}

export const setActiveURL =
  createAction<SetActiveURLPayload>("room/setActiveURL");
