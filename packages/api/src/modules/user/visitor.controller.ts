import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { AccessTokenDTO, VisitorLoginDTO } from "@wewatch/schemas";

import { AuthService } from "../auth";
import { UserService } from "./service";

@Controller("visitors")
export class VisitorController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDTO: VisitorLoginDTO): Promise<AccessTokenDTO> {
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
