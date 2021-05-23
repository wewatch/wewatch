import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ValidationError } from "yup";

import { TypeWithSchema } from "schemas/utils";

interface _ArgumentMetadata extends ArgumentMetadata {
  readonly metatype?: TypeWithSchema | undefined;
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    metadata: _ArgumentMetadata,
  ): Promise<unknown> {
    const schema = metadata?.metatype?.schema;
    if (schema === undefined) {
      return value;
    }

    if (value === null) {
      throw new BadRequestException();
    }

    try {
      return await schema.validate(value, {
        abortEarly: false,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new BadRequestException(e.errors, e.name);
      }

      throw e;
    }
  }
}
