import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

import {
  CreationResultDTO,
  EmptyObject,
  NonPersistedVideoDTO,
  RoomDTO,
} from "@wewatch/schemas";
import { Schema } from "decorators/Schema";

import { RoomService } from "./service";

@Controller("/rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Schema(CreationResultDTO)
  async createRoom(): Promise<CreationResultDTO> {
    return await this.roomService.create();
  }

  @Get("/:id")
  @Schema(RoomDTO)
  async getRoom(@Param("id") roomId: string): Promise<RoomDTO> {
    const room = await this.roomService.get(roomId);
    if (room === null) {
      throw new NotFoundException();
    }

    return room;
  }

  @Post("/:roomId/playlists/:playlistId/videos")
  @Schema(CreationResultDTO)
  async addVideoToPlaylist(
    @Param("roomId") roomId: string,
    @Param("playlistId") playlistId: string,
    @Body() videoDTO: NonPersistedVideoDTO,
  ): Promise<CreationResultDTO> {
    return this.roomService.addVideoToPlaylist(roomId, playlistId, videoDTO);
  }

  @Delete("/:roomId/playlists/:playlistId/videos/:videoId")
  async deleteVideoFromPlaylist(
    @Param("roomId") roomId: string,
    @Param("playlistId") playlistId: string,
    @Param("videoId") videoId: string,
  ): Promise<EmptyObject> {
    await this.roomService.deleteVideoFromPlaylist(roomId, playlistId, videoId);
    return {};
  }
}
