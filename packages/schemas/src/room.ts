export class VideoDTO {
  url!: string;
  title!: string;
  thumbnailUrl!: string;
}

export class PlaylistDTO {
  id!: string;
  name!: string;
  videos!: VideoDTO[];
}

export class RoomDTO {
  id!: string;
  playlist!: PlaylistDTO;
}

export type Room = RoomDTO;
