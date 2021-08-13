import * as yup from "yup";

import { createActionSchema } from "@/actions/utils";
import { UserInfoDTO, userInfoSchema } from "@/schemas/user";
import { withSchema } from "@/schemas/utils";

import * as memberActions from "./member";

const memberActionSchema = createActionSchema(memberActions);

@withSchema(memberActionSchema)
export class MemberActionDTO {
  type!: string;
  payload?: any;
}

export const wrappedMemberActionSchema = yup.object({
  user: userInfoSchema.required(),
  action: memberActionSchema.required(),
});

@withSchema(wrappedMemberActionSchema)
export class WrappedMemberActionDTO {
  user!: UserInfoDTO;
  action!: MemberActionDTO;
}

export { memberActions };
