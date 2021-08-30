import { Module } from "@nestjs/common";

import { ConfigModule } from "modules/config";
import { RateLimitModule } from "modules/rate-limit";

import { SearchController } from "./controller";
import { SearchService } from "./service";

@Module({
  imports: [ConfigModule, RateLimitModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
