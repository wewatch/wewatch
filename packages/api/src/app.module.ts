import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import { ConfigModule, ConfigService } from "modules/config";
import { RoomModule } from "modules/room";
import { SearchModule } from "modules/search";
import { UserModule } from "modules/user";

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.cfg.LOG_LEVEL,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.cfg.DB_URI,
        user: configService.cfg.DB_USERNAME,
        pass: configService.cfg.DB_PASSWORD,
        authSource: configService.cfg.DB_AUTH_SOURCE,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    RoomModule,
    SearchModule,
    UserModule,
  ],
})
export class AppModule {}
