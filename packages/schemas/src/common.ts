import * as yup from "yup";

import { withSchema } from "./utils";

export const creationResultSchema = yup.object({
  id: yup.string().required(),
});

@withSchema(creationResultSchema)
export class CreationResultDTO {
  id!: string;
}
