import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
} from "@nestjs/common";
import { MongoError } from "mongodb";

import { AccessTokenDTO, CreateUserDTO, UserLoginDTO } from "@wewatch/schemas";
import { AuthService, UseAuthGuard } from "modules/auth";
import { InvalidCredentials } from "utils/exceptions";

import { UserService } from "./service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<AccessTokenDTO> {
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
  async login(@Body() loginDTO: UserLoginDTO): Promise<AccessTokenDTO> {
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
  getUserInfo(): string {
    return "hello";
  }
}
