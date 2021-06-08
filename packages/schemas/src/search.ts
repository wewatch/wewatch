import * as yup from "yup";

import { withSchema } from "./utils";
import { VideoDTO } from "./room";

export const searchSchema = yup.object({
  q: yup.string().required("A query string is required").trim(),
});

@withSchema(searchSchema)
export class SearchDTO {
  q!: string;
}

export type SearchVideoResultDTO = VideoDTO[];
