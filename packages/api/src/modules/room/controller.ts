import { Controller, Get, Param, Post, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { IdDTO } from "@/schemas/common";
import { MemberDTO } from "@/schemas/member";
import { RoomDTO } from "@/schemas/room";
import { Schema } from "decorators/Schema";
import { UseAuthGuard } from "modules/auth";
import { RateLimitService } from "modules/rate-limit";
import { getClientIP } from "utils/misc";

import { MemberService } from "./member.service";
import { RoomService } from "./room.service";

@UseAuthGuard
@Controller("/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly memberService: MemberService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post()
  @Schema(IdDTO)
  async createRoom(@Request() request: FastifyRequest): Promise<IdDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService.createRoomRateLimiter.consume(clientIp);

    return await this.roomService.create();
  }

  @Get("/:id")
  @Schema(RoomDTO)
  async getRoom(
    @Param("id") roomId: string,
    @Request() request: FastifyRequest,
  ): Promise<RoomDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService.interactionRateLimiter.consume(clientIp);

    return await this.roomService.getRoom(roomId);
  }

  @Get("/:id/members")
  @Schema(MemberDTO)
  async getRoomMembers(
    @Param("id") roomId: string,
    @Request() request: FastifyRequest,
  ): Promise<MemberDTO[]> {
    const clientIp = getClientIP(request);
    await this.rateLimitService.interactionRateLimiter.consume(clientIp);

    return await this.memberService.getMembers(roomId, true);
  }
}
