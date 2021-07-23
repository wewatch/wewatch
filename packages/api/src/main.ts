import { NestFactory, Reflector } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { FastifyInstance } from "fastify";
import fastifyHelmet from "fastify-helmet";
import fp from "fastify-plugin";
import { Logger } from "nestjs-pino";

import { SerializerInterceptor } from "interceptors/serializer";
import { ConfigService } from "modules/config";
import { ValidationPipe } from "pipes/validation";

import { AppModule } from "./app.module";
import { COMMON_INTERCEPTORS } from "./interceptors";
import { IoAdapter } from "./io.adapter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  await app.register(fastifyHelmet);
  await app.register(
    fp(async (fastify: FastifyInstance) => {
      fastify.addHook("onRequest", async (req, reply) => {
        reply.headers({
          "Surrogate-Control": "no-store",
          "Cache-Control": "no-store, max-age=0, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        });
      });
    }),
  );

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new SerializerInterceptor(app.get(Reflector)),
    ...COMMON_INTERCEPTORS,
  );

  app.useWebSocketAdapter(new IoAdapter(app));

  const configService = app.get(ConfigService);
  await app.listen(configService.cfg.PORT, "0.0.0.0");

  logger.log(`Listening on ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
