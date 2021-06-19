import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { nanoid } from "nanoid";

import {
  RoomActionDTO as ActionDTO,
  roomActions as actions,
} from "@wewatch/actions";
import { TypeWithSchema, VideoDTO } from "@wewatch/schemas";

import { PlaylistDocument, Room, RoomDocument, VideoDocument } from "./model";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(): Promise<RoomDocument> {
    const room = new this.roomModel({
      playlists: [
        {
          name: nanoid(10),
          videos: [
            {
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              title: "Rick Astley - Never Gonna Give You Up (Video)",
              thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            },
            {
              url: "https://www.youtube.com/watch?v=YuBeBjqKSGQ",
              title:
                "The Magic Flute – Queen of the Night aria (Mozart; Diana Damrau, The Royal Opera)",
              thumbnailUrl: "https://i.ytimg.com/vi/YuBeBjqKSGQ/hqdefault.jpg",
            },
          ],
        },
      ],
    });

    return await room.save();
  }

  async get(id: string): Promise<RoomDocument | null> {
    return this.roomModel.findById(id).exec();
  }

  async handleAction(roomId: string, action: ActionDTO): Promise<ActionDTO> {
    let payload = null;

    if (actions.addVideo.match(action)) {
      const { playlistId, video } = action.payload;
      const newVideo = await this.addVideoToPlaylist(roomId, playlistId, video);
      payload = { playlistId, video: newVideo };
    } else if (actions.deleteVideo.match(action)) {
      const { playlistId, videoId } = action.payload;
      await this.deleteVideoFromPlaylist(roomId, playlistId, videoId);
    }

    if (payload !== null) {
      const schema = (ActionDTO as TypeWithSchema<ActionDTO>).schema;

      if (schema === undefined) {
        return action;
      }

      return schema.cast(
        {
          ...action,
          payload,
        },
        {
          stripUnknown: true,
        },
      ) as ActionDTO;
    }

    return action;
  }

  async getRoomAndPlaylist(
    roomId: string,
    playlistId: string,
  ): Promise<{
    room: RoomDocument;
    playlist: PlaylistDocument;
  }> {
    const room = await this.get(roomId);
    if (room === null) {
      throw new NotFoundException("Room not found");
    }

    const playlist = room.playlists.id(playlistId);
    if (playlist === null) {
      throw new NotFoundException("Playlist not found");
    }

    return { room, playlist };
  }

  async addVideoToPlaylist(
    roomId: string,
    playlistId: string,
    videoDTO: VideoDTO,
  ): Promise<VideoDocument> {
    const { room, playlist } = await this.getRoomAndPlaylist(
      roomId,
      playlistId,
    );

    const existingVideo = playlist.videos.find(
      (video) => video.url === videoDTO.url,
    );
    if (existingVideo) {
      throw new BadRequestException("This video is already in the playlist");
    }

    const length = playlist.videos.push(videoDTO);
    await room.save();

    return playlist.videos[length - 1];
  }

  async deleteVideoFromPlaylist(
    roomId: string,
    playlistId: string,
    videoId: string,
  ): Promise<RoomDocument> {
    const { room, playlist } = await this.getRoomAndPlaylist(
      roomId,
      playlistId,
    );

    const existingVideo = playlist.videos.id(videoId);
    if (existingVideo === null) {
      throw new NotFoundException("Video not found");
    }

    playlist.videos.remove(videoId);

    return await room.save();
  }
}
