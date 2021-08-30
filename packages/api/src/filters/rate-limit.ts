import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { RateLimiterRes } from "rate-limiter-flexible";

@Catch(RateLimiterRes)
export class RateLimitExceptionFilter implements ExceptionFilter {
  catch(exception: RateLimiterRes, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = HttpStatus.TOO_MANY_REQUESTS;
    const message = "Too Many Requests";

    response
      .status(statusCode)
      .header("Retry-After", exception.msBeforeNext / 1000)
      .send({
        statusCode,
        message,
      });
  }
}
