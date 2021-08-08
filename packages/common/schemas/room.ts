import * as yup from "yup";

import { idSchema } from "./common";
import { withSchema } from "./utils";

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

export const rankSchema = yup.object({
  rank: yup.string().required().trim(),
});

export const videoSchema = newVideoSchema.concat(idSchema).concat(rankSchema);

@withSchema(videoSchema)
export class VideoDTO extends NewVideoDTO {
  id!: string;
  rank!: string;
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

export const playerStateSchema = yup.object({
  url: yup.string().url().required().nullable(),
  activePlaylistId: yup.string().required().nullable(),
  playing: yup.boolean().required(),
});

@withSchema(playerStateSchema)
export class PlayerStateDTO {
  url!: string | null;
  activePlaylistId!: string | null;
  playing!: boolean;
}

export const roomSchema = yup
  .object({
    playlists: yup.array().of(playlistSchema),
    playerState: playerStateSchema,
  })
  .concat(idSchema);

@withSchema(roomSchema)
export class RoomDTO {
  id!: string;
  playlists!: PlaylistDTO[];
  playerState!: PlayerStateDTO;
}

export type Room = RoomDTO;
