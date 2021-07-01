import * as yup from "yup";

import { withSchema } from "./utils";

export const idSchema = yup.object({
  id: yup.string().required().trim(),
});

@withSchema(idSchema)
export class IdDTO {
  id!: string;
}
