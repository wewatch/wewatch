import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "modules/user";
import { User } from "modules/user/model";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  createAccessToken(user: User): string {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload);
  }
}
