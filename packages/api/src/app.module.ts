import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { LogLevel } from "@sentry/types";
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
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.cfg.SENTRY_DSN,
        debug: false,
        environment: configService.cfg.NODE_ENV,
        logLevel: LogLevel.Error,
        sampleRate: 1,
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    RoomModule,
    SearchModule,
    UserModule,
  ],
})
export class AppModule {}
