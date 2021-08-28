import { Module } from "@nestjs/common";

import { RoomModule } from "modules/room";

import { CronService } from "./cron.service";

@Module({
  imports: [RoomModule],
  providers: [CronService],
})
export class CronModule {}
