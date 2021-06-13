import { NonPersistedVideoDTO } from "./room";

export interface AddVideoToPlayList {
  roomId: string;
  playlistId: string;
  video: NonPersistedVideoDTO;
}

export interface DeleteVideoFromPlaylist {
  roomId: string;
  playlistId: string;
  videoId: string;
}
