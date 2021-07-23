import { Module } from "@nestjs/common";

import { APP_MODULES } from "./app";
import { NEST_MODULES } from "./nest";
import { THIRD_PARTY_MODULES } from "./third-party";

@Module({
  imports: [...NEST_MODULES, ...APP_MODULES, ...THIRD_PARTY_MODULES],
})
export class AppModule {}
