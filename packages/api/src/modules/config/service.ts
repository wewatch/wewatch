import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { LevelWithSilent } from "pino";
import * as yup from "yup";

type Env = "local" | "development" | "production" | "test";

type Config = {
  NODE_ENV: Env;
  PORT: number;
  LOG_LEVEL: LevelWithSilent;

  DB_URI: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_AUTH_SOURCE?: string;

  JWT_SECRET: string;
  JWT_EXPIRE_INTERVAL: string;

  SEARCH_SERVICE_URL: string;
  SEARCH_SERVICE_API_KEY: string;

  SENTRY_DSN: string;
};

export const configSchema: yup.SchemaOf<Config> = yup.object({
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

  SENTRY_DSN: yup.string().required(),
});

@Injectable()
export class ConfigService {
  cfg: Config;

  constructor() {
    dotenv.config();

    this.cfg = configSchema.validateSync(process.env);
  }
}
