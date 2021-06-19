import { withSchema } from "./utils";
import * as yup from "yup";
import { idSchema } from "./common";

export const newVideoSchema = yup.object({
  url: yup.string().url().required().trim(),
  title: yup.string().required().trim(),
  thumbnailUrl: yup.string().url().required().trim(),
});

@withSchema(newVideoSchema)
export class NewVideoDTO {
  url!: string;
  title!: string;
  thumbnailUrl!: string;
}

export const videoSchema = newVideoSchema.concat(idSchema);

@withSchema(videoSchema)
export class VideoDTO extends NewVideoDTO {
  id!: string;
}

export const playlistSchema = yup
  .object({
    name: yup.string().required().trim(),
    videos: yup.array().of(videoSchema),
  })
  .concat(idSchema);

@withSchema(playlistSchema)
export class PlaylistDTO {
  id!: string;
  name!: string;
  videos!: VideoDTO[];
}

export const roomSchema = yup
  .object({
    playlists: yup.array().of(playlistSchema),
    activePlaylistId: yup.string().nullable(),
  })
  .concat(idSchema);

@withSchema(roomSchema)
export class RoomDTO {
  id!: string;
  playlists!: PlaylistDTO[];
  activePlaylistId!: string | null;
  activeVideoURL!: string | null;
}

export type Room = RoomDTO;
