import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from "modules/config";
import { User } from "modules/user";

import { AuthService } from "./service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.cfg.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    return this.authService.verifyJwtSubject(payload.sub);
  }
}
