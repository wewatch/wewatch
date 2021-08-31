import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";
import { FastifyReply } from "fastify";
import { RateLimiterRes } from "rate-limiter-flexible";
import { Socket } from "socket.io";

const ERROR_MESSAGE = "Too Many Requests";

@Catch(RateLimiterRes)
export class RateLimitExceptionFilter implements ExceptionFilter {
  catch(exception: RateLimiterRes, host: ArgumentsHost): void {
    switch (host.getType()) {
      case "http":
        return this.handleHTTPRateLimit(host.switchToHttp(), exception);
      case "ws":
        return this.handleWSRateLimit(host.switchToWs());
    }
  }

  handleHTTPRateLimit(
    host: HttpArgumentsHost,
    exception: RateLimiterRes,
  ): void {
    const response = host.getResponse<FastifyReply>();
    const statusCode = HttpStatus.TOO_MANY_REQUESTS;

    response
      .status(statusCode)
      .header("Retry-After", exception.msBeforeNext / 1000)
      .send({
        statusCode,
        message: ERROR_MESSAGE,
      });
  }

  handleWSRateLimit(host: WsArgumentsHost): void {
    const client = host.getClient<Socket>();

    client.emit("exception", {
      status: "error",
      message: ERROR_MESSAGE,
    });
  }
}
