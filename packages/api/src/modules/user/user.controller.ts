import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { MongoError } from "mongodb";

import {
  AccessTokenDTO,
  CreateUserDTO,
  UpdateUserInfoDTO,
  UserInfoDTO,
  UserLoginDTO,
} from "@/schemas/user";
import { Schema } from "decorators/Schema";
import { AuthService, UseAuthGuard } from "modules/auth";
import { RateLimitService } from "modules/rate-limit";
import { InvalidCredentials } from "utils/exceptions";
import type { RequestWithUser } from "utils/interface";
import { getClientIP } from "utils/misc";

import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
    @Request() request: FastifyRequest,
  ): Promise<AccessTokenDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService
      .getRateLimiter(6)
      .consume(`createUser:${clientIp}`);

    try {
      const { email, password } = createUserDTO;
      const user = await this.userService.createUser(email, password);
      return {
        accessToken: this.authService.createAccessToken(user),
      };
    } catch (e) {
      if (e instanceof MongoError && e?.code === 11000) {
        throw new BadRequestException("Email already exists");
      }

      throw e;
    }
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginDTO: UserLoginDTO,
    @Request() request: FastifyRequest,
  ): Promise<AccessTokenDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService
      .getRateLimiter(2)
      .consume(`userLogin:${clientIp}`);

    const { email, password } = loginDTO;
    const user = await this.userService.findByEmailAndPassword(email, password);
    if (user === null) {
      throw new InvalidCredentials();
    }

    return {
      accessToken: this.authService.createAccessToken(user),
    };
  }

  @UseAuthGuard
  @Get("me")
  @Schema(UserInfoDTO)
  async getUserInfo(@Request() request: RequestWithUser): Promise<UserInfoDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService
      .getRateLimiter(1)
      .consume(`getUserInfo:${clientIp}`);

    return request.user;
  }

  @UseAuthGuard
  @Put("me")
  @Schema(UserInfoDTO)
  async updateUserInfo(
    @Request() request: RequestWithUser,
    @Body() updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<UserInfoDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService
      .getRateLimiter(1)
      .consume(`updateUserInfo:${clientIp}`);

    const user = await this.userService.update(
      request.user.id,
      updateUserInfoDTO,
    );

    if (user === null) {
      throw new InvalidCredentials();
    }

    return user;
  }
}
