import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { isObject } from "@nestjs/common/utils/shared.utils";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseSchema } from "yup";

export interface PlainLiteralObject {
  [key: string]: unknown;
}

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const schema: BaseSchema | undefined = this.reflector.get(
      "schema",
      context.getHandler(),
    );

    return next
      .handle()
      .pipe(
        map((response: PlainLiteralObject | Array<PlainLiteralObject>) =>
          this.serialize(response, schema),
        ),
      );
  }

  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
    schema?: BaseSchema,
  ): PlainLiteralObject | PlainLiteralObject[] {
    if (schema === undefined) {
      return response;
    }

    const isArray = Array.isArray(response);

    if (!isObject(response) && !isArray) {
      return response;
    }

    return isArray
      ? (response as PlainLiteralObject[]).map((item) =>
          this.transform(item, schema),
        )
      : this.transform(response, schema);
  }

  transform(value: unknown, schema: BaseSchema): PlainLiteralObject {
    return schema.cast(value, { stripUnknown: true });
  }
}
