import * as roomActions from "./room";
import { createActionSchema } from "./utils";
import { withSchema } from "@wewatch/schemas";

export { roomActions };

const roomActionSchema = createActionSchema(roomActions);

@withSchema(roomActionSchema)
export class RoomActionDTO {
  type!: string;
  payload!: any;
}
