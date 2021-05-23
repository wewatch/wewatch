import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

import { RoomDTO } from "@wewatch/schemas";

import { RoomService } from "./service";

@Controller("rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(): Promise<RoomDTO> {
    return await this.roomService.create();
  }

  @Get(":id")
  async getRoom(@Param("id") roomId: string): Promise<RoomDTO> {
    const room = await this.roomService.get(roomId);
    if (room === null) {
      throw new NotFoundException();
    }

    return room;
  }
}
