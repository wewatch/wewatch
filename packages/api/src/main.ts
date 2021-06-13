import { NestFactory, Reflector } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyHelmet from "fastify-helmet";
import { Logger } from "nestjs-pino";

import { SerializerInterceptor } from "interceptors/serializer";
import { ConfigService } from "modules/config";
import { ValidationPipe } from "pipes/validation";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  await app.register(fastifyHelmet);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);
  await app.listen(configService.cfg.PORT);

  logger.log(`Listening on ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
