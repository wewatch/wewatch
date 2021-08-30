import { NestFactory, Reflector } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { RateLimitExceptionFilter } from "filters/rate-limit";
import { COMMON_INTERCEPTORS } from "interceptors";
import { SerializerInterceptor } from "interceptors/serializer";
import { AppModule } from "modules/app";
import { ConfigService } from "modules/config";
import { ValidationPipe } from "pipes/validation";

import { fastifyInstance } from "./fastify-instance";
import { IoAdapter } from "./io.adapter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  app.enableCors();

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new SerializerInterceptor(app.get(Reflector)),
    ...COMMON_INTERCEPTORS,
  );
  app.useGlobalFilters(new RateLimitExceptionFilter());

  app.useWebSocketAdapter(new IoAdapter(app));

  const configService = app.get(ConfigService);
  await app.listen(configService.cfg.PORT, "0.0.0.0");

  logger.log(`Listening on ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
