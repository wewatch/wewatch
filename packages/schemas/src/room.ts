import { withSchema } from "./utils";
import * as yup from "yup";
import { idSchema } from "./common";
import { MemberDTO, memberSchema } from "./member";

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

export const playerStateSchema = yup.object({
  url: yup.string().url().required().nullable(),
  playing: yup.boolean().required(),
  played: yup.number().required().min(0).max(100),
});

@withSchema(playerStateSchema)
export class PlayerStateDTO {
  url!: string | null;
  playing!: boolean;
  played!: number;
}

export const roomSchema = yup
  .object({
    playlists: yup.array().of(playlistSchema),
    activePlaylistId: yup.string().required().nullable(),
    playerState: playerStateSchema,
    members: yup.array().of(memberSchema),
  })
  .concat(idSchema);

@withSchema(roomSchema)
export class RoomDTO {
  id!: string;
  playlists!: PlaylistDTO[];
  activePlaylistId!: string | null;
  playerState!: PlayerStateDTO;
  members!: MemberDTO[];
}

export type Room = RoomDTO;
