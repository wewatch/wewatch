import { ModuleMetadata } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SentryModule } from "@ntegral/nestjs-sentry";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { LogLevel } from "@sentry/types";
import { LoggerModule } from "nestjs-pino";

import { ConfigService } from "modules/config";

import { tracesSampler } from "./utils";

const loggerModule = LoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    pinoHttp: {
      level: configService.cfg.LOG_LEVEL,
    },
  }),
});

const mongooseModule = MongooseModule.forRootAsync({
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
});

const sentryModule = SentryModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    dsn: configService.cfg.SENTRY_DSN,
    debug: false,
    environment: configService.cfg.NODE_ENV,
    logLevel: LogLevel.Error,
    sampleRate: 1,
    tracesSampler,
    integrations: [
      new Sentry.Integrations.Http({
        tracing: true,
      }),
      new Tracing.Integrations.Mongo({
        useMongoose: true,
      }),
    ],
  }),
});

export const THIRD_PARTY_MODULES: NonNullable<ModuleMetadata["imports"]> = [
  loggerModule,
  mongooseModule,
  sentryModule,
];
