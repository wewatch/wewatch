import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { ConfigService } from "modules/config";
import { ValidationPipe } from "pipes/validation";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  await app.listen(configService.cfg.PORT);

  logger.log(`Listening on ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
