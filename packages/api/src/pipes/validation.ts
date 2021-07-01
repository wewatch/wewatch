import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { ValidationError } from "yup";

import { TypeWithSchema } from "@/schemas/utils";

interface _ArgumentMetadata extends ArgumentMetadata {
  readonly metatype?: TypeWithSchema | undefined;
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructException(errors?: string[], description?: string): Error {
    return new BadRequestException(errors, description);
  }

  async transform(
    value: unknown,
    metadata: _ArgumentMetadata,
  ): Promise<unknown> {
    const schema = metadata?.metatype?.schema;
    if (schema === undefined) {
      return value;
    }

    if (value === null) {
      throw this.constructException();
    }

    try {
      return await schema.validate(value, {
        abortEarly: false,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        throw this.constructException(e.errors, e.name);
      }

      throw e;
    }
  }
}

@Injectable()
export class WsValidationPipe extends ValidationPipe implements PipeTransform {
  constructException(errors?: string[], description?: string): Error {
    return new WsException({
      error: description,
      message: errors,
    });
  }
}
