import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { TypeWithSchema } from "@/schemas/utils";

export const Schema = (dtoClass: TypeWithSchema): CustomDecorator =>
  SetMetadata("schema", dtoClass.schema);
