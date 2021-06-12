import { withSchema } from "./utils";
import * as yup from "yup";

export class NonPersistedVideoDTO {
  url!: string;
  title!: string;
  thumbnailUrl!: string;
}

export const videoSchema = yup.object({
  url: yup.string().url().required().trim(),
  title: yup.string().required().trim(),
  thumbnailUrl: yup.string().url().required().trim(),
});

@withSchema(videoSchema)
export class VideoDTO extends NonPersistedVideoDTO {
  id!: string;
}

export class PlaylistDTO {
  id!: string;
  name!: string;
  videos!: VideoDTO[];
}

export class RoomDTO {
  id!: string;
  playlists!: PlaylistDTO[];
}

export type Room = RoomDTO;
