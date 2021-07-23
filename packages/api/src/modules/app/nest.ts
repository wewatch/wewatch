import { ModuleMetadata } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";

export const NEST_MODULES: NonNullable<ModuleMetadata["imports"]> = [
  EventEmitterModule.forRoot(),
  ScheduleModule.forRoot(),
];
