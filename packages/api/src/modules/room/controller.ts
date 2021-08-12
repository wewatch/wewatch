import { Controller, Get, Param, Post } from "@nestjs/common";

import { IdDTO } from "@/schemas/common";
import { MemberDTO } from "@/schemas/member";
import { RoomDTO } from "@/schemas/room";
import { Schema } from "decorators/Schema";
import { UseAuthGuard } from "modules/auth";

import { MemberService } from "./member.service";
import { RoomService } from "./room.service";

@UseAuthGuard
@Controller("/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly memberService: MemberService,
  ) {}

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
    return await this.memberService.getMembers(roomId, true);
  }
}
