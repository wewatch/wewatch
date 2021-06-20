import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "modules/user/model";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(user: User): string {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload);
  }
}
