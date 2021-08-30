import { Body, Controller, HttpCode, Post, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { AccessTokenDTO, VisitorLoginDTO } from "@/schemas/user";
import { AuthService } from "modules/auth";
import { RateLimitService } from "modules/rate-limit";
import { getClientIP } from "utils/misc";

import { UserService } from "./user.service";

@Controller("visitors")
export class VisitorController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginDTO: VisitorLoginDTO,
    @Request() request: FastifyRequest,
  ): Promise<AccessTokenDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService.loginRateLimiter.consume(clientIp);

    const { visitorId } = loginDTO;
    let user = await this.userService.findByVisitorId(visitorId);
    if (user === null) {
      user = await this.userService.createVisitor(visitorId);
    }

    return {
      accessToken: this.authService.createAccessToken(user),
    };
  }
}
