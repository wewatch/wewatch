import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from "modules/config";
import { UserService } from "modules/user";
import { User } from "modules/user/model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.cfg.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    const userId = payload.sub;
    const user = await this.userService.get(userId);

    if (user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
