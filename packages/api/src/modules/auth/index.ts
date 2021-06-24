import { forwardRef, Global, Module, UseGuards } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { ConfigService } from "modules/config";
import { UserModule } from "modules/user";

import { JwtAuthGuard } from "./guard";
import { AuthService } from "./service";
import { JwtStrategy } from "./strategy";

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.cfg.JWT_SECRET,
        signOptions: {
          expiresIn: configService.cfg.JWT_EXPIRE_INTERVAL,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

export const UseAuthGuard = UseGuards(JwtAuthGuard);

export { AuthService };
