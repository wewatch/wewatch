import { createActionSchema } from "@/actions/utils";
import { withSchema } from "@/schemas/utils";

import * as roomActions from "./room";

const roomActionSchema = createActionSchema(roomActions);

@withSchema(roomActionSchema)
export class RoomActionDTO {
  type!: string;
  payload!: any;
}

export class RoomActionWithUserDTO {
  userId!: string | null;
  action!: RoomActionDTO;
}

export { roomActions };
