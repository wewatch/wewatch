import type { ModuleMetadata } from "@nestjs/common";

import { ConfigModule } from "modules/config";
import { CronModule } from "modules/cron";
import { RoomModule } from "modules/room";
import { SearchModule } from "modules/search";
import { UserModule } from "modules/user";

export const APP_MODULES: NonNullable<ModuleMetadata["imports"]> = [
  ConfigModule,
  CronModule,
  RoomModule,
  SearchModule,
  UserModule,
];
