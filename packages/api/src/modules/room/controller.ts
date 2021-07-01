import { Controller, Get, Param, Post } from "@nestjs/common";

import { IdDTO } from "@wewatch/common/schemas/common";
import { MemberDTO } from "@wewatch/common/schemas/member";
import { RoomDTO } from "@wewatch/common/schemas/room";
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
    return await this.roomService.getRoom(roomId);
  }

  @Get("/:id/members")
  @Schema(MemberDTO)
  async getRoomMembers(@Param("id") roomId: string): Promise<MemberDTO[]> {
    return await this.roomService.getMembers(roomId, true);
  }
}
