import * as yup from "yup";

import { NewVideoDTO } from "./room";
import { withSchema } from "./utils";

export const searchSchema = yup.object({
  query: yup.string().required("a query string is required").max(256).trim(),
});

@withSchema(searchSchema)
export class SearchDTO {
  query!: string;
}

export type SearchVideoResultDTO = NewVideoDTO[];

export interface SearchVideoErrorDTO {
  message: string;
}
