import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import * as dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";

import { AppModule } from "../app.module";
import { ValidationPipe } from "../pipes/validation";

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env.test"),
});

export let app: NestFastifyApplication;

const mongod = new MongoMemoryServer();

beforeAll(async () => {
  process.env.DB_URI = await mongod.getUri();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

afterAll(async () => {
  await app.close();
  await mongod.stop();
});
