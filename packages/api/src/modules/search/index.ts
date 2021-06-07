import { Module } from "@nestjs/common";

import { ConfigModule } from "modules/config";

import { SearchController } from "./controller";
import { SearchService } from "./service";

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
