import { HttpException, NestInterceptor } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import {
  SentryInterceptor,
  SentryInterceptorOptionsFilter,
} from "@ntegral/nestjs-sentry";

import { TracingInterceptor } from "./tracing";

const SENTRY_INTERCEPTOR_FILTERS: SentryInterceptorOptionsFilter[] = [
  {
    type: WsException,
  },
  {
    type: HttpException,
    filter: (e: HttpException) => e.getStatus() < 500,
  },
];

export const COMMON_INTERCEPTORS: NestInterceptor[] = [
  new SentryInterceptor({
    filters: SENTRY_INTERCEPTOR_FILTERS,
  }),
  new TracingInterceptor(),
];
