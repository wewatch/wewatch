import * as yup from "yup";

import { createActionSchema } from "@/actions/utils";
import { withSchema } from "@/schemas/utils";

import * as memberActions from "./member";

const memberActionSchema = createActionSchema(memberActions);

@withSchema(memberActionSchema)
export class MemberActionDTO {
  type!: string;
  payload?: any;
}

export const wrappedMemberActionSchema = yup.object({
  userId: yup.string().required(),
  action: memberActionSchema.required(),
  timestamp: yup.number().required(),
});

@withSchema(wrappedMemberActionSchema)
export class WrappedMemberActionDTO {
  userId!: string;
  action!: MemberActionDTO;
  timestamp!: number;
}

export { memberActions };
