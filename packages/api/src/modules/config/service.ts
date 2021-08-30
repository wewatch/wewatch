import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { LevelWithSilent } from "pino";
import * as yup from "yup";
import { Asserts } from "yup/lib/util/types";

type Env = "local" | "development" | "production" | "test";

export const configSchema = yup.object({
  NODE_ENV: yup
    .mixed<Env>()
    .required()
    .oneOf(["local", "development", "production", "test"]),

  PORT: yup.number().required(),
  LOG_LEVEL: yup
    .mixed<LevelWithSilent>()
    .required()
    .oneOf(["fatal", "error", "warn", "info", "debug", "trace"]),

  DB_URI: yup.string().required(),
  DB_USERNAME: yup.string().optional().nullable(false),
  DB_PASSWORD: yup.string().optional().nullable(false),
  DB_AUTH_SOURCE: yup.string().optional().nullable(false),

  JWT_SECRET: yup.string().required(),
  JWT_EXPIRE_INTERVAL: yup.string().default("30d"),

  SEARCH_SERVICE_URL: yup.string().required(),
  SEARCH_SERVICE_API_KEY: yup.string().required(),

  SENTRY_ENABLED: yup.boolean().default(false),
  SENTRY_DSN: yup.string().required(),

  RATE_LIMIT_CREATE_ROOM_POINT: yup.number().required(),
  RATE_LIMIT_CREATE_ROOM_DURATION: yup.number().required(),
  RATE_LIMIT_SEARCH_POINT: yup.number().required(),
  RATE_LIMIT_SEARCH_DURATION: yup.number().required(),
  RATE_LIMIT_LOGIN_POINT: yup.number().required(),
  RATE_LIMIT_LOGIN_DURATION: yup.number().required(),
  RATE_LIMIT_INTERACTION_POINT: yup.number().required(),
  RATE_LIMIT_INTERACTION_DURATION: yup.number().required(),
});

@Injectable()
export class ConfigService {
  cfg: Asserts<typeof configSchema>;

  constructor() {
    dotenv.config();

    this.cfg = configSchema.validateSync(process.env);
  }
}
