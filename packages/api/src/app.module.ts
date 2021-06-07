import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "nestjs-pino";

import { ConfigModule, ConfigService } from "modules/config";
import { RoomModule } from "modules/room";
import { SearchModule } from "modules/search";
import { UserModule } from "modules/user";
import mongooseId from "utils/mongooseId";

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
        connectionFactory: (connection) => {
          connection.plugin(mongooseId);
          return connection;
        },
      }),
    }),
    RoomModule,
    SearchModule,
    UserModule,
  ],
})
export class AppModule {}
