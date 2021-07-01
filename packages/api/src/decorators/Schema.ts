import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { TypeWithSchema } from "@wewatch/common/schemas/utils";

export const Schema = (dtoClass: TypeWithSchema): CustomDecorator =>
  SetMetadata("schema", dtoClass.schema);
