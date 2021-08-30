import { Module } from "@nestjs/common";

import { ConfigModule } from "modules/config";

import { RateLimitService } from "./service";

@Module({
  imports: [ConfigModule],
  providers: [RateLimitService],
  exports: [RateLimitService],
})
export class RateLimitModule {}

export { RateLimitService };
