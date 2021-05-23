import { Global, Module } from "@nestjs/common";

import { ConfigService } from "./service";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

export { ConfigService };
