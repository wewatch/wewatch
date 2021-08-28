import { Module } from "@nestjs/common";

import { RoomModule } from "modules/room";
import { UserModule } from "modules/user";

import { CronService } from "./cron.service";

@Module({
  imports: [RoomModule, UserModule],
  providers: [CronService],
})
export class CronModule {}
