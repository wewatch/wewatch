import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

import { IdDTO, RoomDTO } from "@wewatch/schemas";
import { Schema } from "decorators/Schema";

import { RoomService } from "./service";

@Controller("/rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Schema(IdDTO)
  async createRoom(): Promise<IdDTO> {
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
}
