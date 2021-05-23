import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { LoggerModule } from "nestjs-pino";

import { ConfigModule, ConfigService } from "modules/config";
import { UserModule } from "modules/user";

export const mongod = new MongoMemoryServer();

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
      // useFactory: async () => {
      //   const uri = await mongod.getUri();
      //   return {
      //     uri,
      //     useCreateIndex: true,
      //     useNewUrlParser: true,
      //     useFindAndModify: false,
      //     useUnifiedTopology: true,
      //   };
      // },
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
    UserModule,
  ],
})
export class AppModule {}
