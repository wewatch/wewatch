import { withSchema } from "@wewatch/schemas";

import * as roomActions from "./room";
import { createActionSchema } from "./utils";

export { roomActions };

const roomActionSchema = createActionSchema(roomActions);

@withSchema(roomActionSchema)
export class RoomActionDTO {
  type!: string;
  payload!: any;
}

export class RoomActionWithUserDTO {
  userId!: string;
  action!: RoomActionDTO;
}
