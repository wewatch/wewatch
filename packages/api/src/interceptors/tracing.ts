import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { HttpArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";
import * as Sentry from "@sentry/node";
import { Event, Transaction } from "@sentry/types";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { IncomingHttpHeaders } from "http";
import { Observable, tap } from "rxjs";

import { RoomActionDTO } from "@/actions/room";

const SENSITIVE_HEADERS: (keyof IncomingHttpHeaders)[] = [
  "authorization",
  "set-cookie",
  "cookie",
];

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const transaction = Sentry.startTransaction({
      name: context.getHandler().name,
    });

    Sentry.configureScope((scope) => {
      scope.setSpan(transaction);
      this.setTransactionAttributes(transaction, context);
      scope.addEventProcessor((event) =>
        this.setEventAttributes(event, context),
      );
    });

    return next.handle().pipe(tap(() => transaction.finish()));
  }

  setEventAttributes(event: Event, context: ExecutionContext): Event {
    switch (context.getType<ContextType>()) {
      case "http":
        return this.setEventAttributesFromHTTPContext(
          event,
          context.switchToHttp(),
        );
      case "ws":
        return this.setEventAttributesFromWsContext(
          event,
          context.switchToWs(),
        );
    }

    return event;
  }

  setEventAttributesFromHTTPContext(
    event: Event,
    host: HttpArgumentsHost,
  ): Event {
    const {
      url,
      method,
      headers: rawHeaders,
    } = host.getRequest<FastifyRequest>();

    const headers: Record<string, string> = Object.entries(rawHeaders).reduce(
      (accumulate, [k, v]) => {
        if (typeof v === "string" && !SENSITIVE_HEADERS.includes(k)) {
          accumulate[k] = v;
        }
        return accumulate;
      },
      {} as Record<string, string>,
    );

    event.request = {
      url,
      method,
      headers,
    };

    return event;
  }

  setEventAttributesFromWsContext(event: Event, _host: WsArgumentsHost): Event {
    event.request = undefined;
    return event;
  }

  setTransactionAttributes(
    transaction: Transaction,
    context: ExecutionContext,
  ): void {
    switch (context.getType<ContextType>()) {
      case "http":
        this.setTransactionAttributesFromHTTPContext(
          transaction,
          context.switchToHttp(),
        );
        return;
      case "ws":
        this.setTransactionAttributesFromWSContext(
          transaction,
          context.switchToWs(),
        );
        return;
    }
  }

  setTransactionAttributesFromHTTPContext(
    transaction: Transaction,
    host: HttpArgumentsHost,
  ): void {
    const request = host.getRequest<FastifyRequest>();
    const response = host.getResponse<FastifyReply>();

    transaction.op = "http";
    transaction.setTag("url", request.url);
    transaction.setTag("method", request.method);
    transaction.setHttpStatus(response.statusCode);
  }

  setTransactionAttributesFromWSContext(
    transaction: Transaction,
    host: WsArgumentsHost,
  ): void {
    const data = host.getData();

    transaction.op = "ws";
    transaction.setData("data", data);

    if (transaction.name === "onActionEvent") {
      transaction.setName(
        `${transaction.name}:${(data as RoomActionDTO).type}`,
      );
    }
  }
}
