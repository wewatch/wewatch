import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { TypeWithSchema } from "@wewatch/schemas";

export const Schema = (dtoClass: TypeWithSchema): CustomDecorator =>
  SetMetadata("schema", dtoClass.schema);
