import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

import { NonPersistedVideoDTO, RoomDTO, VideoDTO } from "@wewatch/schemas";

import { RoomService } from "./service";

@Controller("/rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(): Promise<RoomDTO> {
    return await this.roomService.create();
  }

  @Get("/:id")
  async getRoom(@Param("id") roomId: string): Promise<RoomDTO> {
    const room = await this.roomService.get(roomId);
    if (room === null) {
      throw new NotFoundException();
    }

    return room;
  }

  @Post("/:roomId/playlists/:playlistId/videos")
  async addVideoToPlaylist(
    @Param("roomId") roomId: string,
    @Param("playlistId") playlistId: string,
    @Body() videoDTO: NonPersistedVideoDTO,
  ): Promise<RoomDTO> {
    return this.roomService.addVideoToPlaylist(roomId, playlistId, videoDTO);
  }

  @Delete("/:roomId/playlists/:playlistId/videos/:videoId")
  async deleteVideoFromPlaylist(
    @Param("roomId") roomId: string,
    @Param("playlistId") playlistId: string,
    @Param("videoId") videoId: string,
  ): Promise<RoomDTO> {
    return this.roomService.deleteVideoFromPlaylist(
      roomId,
      playlistId,
      videoId,
    );
  }
}
