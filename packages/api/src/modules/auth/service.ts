import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserDocument, UserService } from "modules/user";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  createAccessToken(user: UserDocument): string {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload);
  }

  async verifyJwtSubject(subject: string): Promise<UserDocument> {
    const user = await this.userService.get(subject);

    if (user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
