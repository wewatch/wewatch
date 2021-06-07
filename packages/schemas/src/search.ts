import * as yup from "yup";

import { withSchema } from "./utils";
import { VideoDTO } from "./room";

export const searchVideoSchema = yup.object({
  q: yup.string().required(),
});

@withSchema(searchVideoSchema)
export class SearchVideoDTO {
  q!: string;
}

export type SearchVideoResultDTO = VideoDTO[];
