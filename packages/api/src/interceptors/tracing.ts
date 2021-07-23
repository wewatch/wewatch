import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { HttpArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";
import * as Sentry from "@sentry/node";
import { Event, Transaction, User as SentryUser } from "@sentry/types";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { IncomingHttpHeaders } from "http";
import { Observable, tap } from "rxjs";
import { Socket } from "socket.io";

import { RoomActionDTO } from "@/actions/room";
import { User } from "modules/user/model";
import { RequestWithUser } from "utils/interface";

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

    if ("user" in request) {
      const user = (request as RequestWithUser).user;
      setSentryUser(user);
    }
  }

  setTransactionAttributesFromWSContext(
    transaction: Transaction,
    host: WsArgumentsHost,
  ): void {
    const data = host.getData();
    const client = host.getClient<Socket>();

    transaction.op = "ws";
    transaction.setData("data", data);

    if ("user" in client.data) {
      const user: User = client.data.user;
      setSentryUser(user);
    }

    if (transaction.name === "onActionEvent") {
      transaction.setName(
        `${transaction.name}:${(data as RoomActionDTO).type}`,
      );
    }
  }
}

const setSentryUser = (user: User) => {
  const sentryUser: SentryUser = {
    id: user.id,
    username: user.name,
  };

  if (user.email !== undefined) {
    sentryUser.email = user.email;
  }

  Sentry.setUser(sentryUser);
};
