import * as yup from "yup";

import { UserInfoDTO, userInfoSchema } from "./user";
import { withSchema } from "./utils";

export const memberSchema = yup.object({
  user: userInfoSchema,
  online: yup.boolean().required(),
});

@withSchema(memberSchema)
export class MemberDTO {
  user!: UserInfoDTO;
  online!: boolean;
}
