import * as yup from "yup";

import { createActionSchema } from "@/actions/utils";
import { withSchema } from "@/schemas/utils";

import * as roomActions from "./room";

const roomActionSchema = createActionSchema(roomActions);

@withSchema(roomActionSchema)
export class RoomActionDTO {
  type!: string;
  payload?: any;
}

export const wrappedRoomActionSchema = yup.object({
  userId: yup.string().required().nullable(true),
  action: roomActionSchema.required(),
  timestamp: yup.number().required(),
});

@withSchema(wrappedRoomActionSchema)
export class WrappedRoomActionDTO {
  userId!: string | null;
  action!: RoomActionDTO;
  timestamp!: number;
}

export { roomActions };
