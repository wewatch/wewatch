import { withSchema } from "./utils";
import * as yup from "yup";
import { UserInfoDTO, userInfoSchema } from "./user";

export const memberSchema = userInfoSchema.concat(
  yup.object({
    isOnline: yup.boolean().required(),
  }),
);

@withSchema(memberSchema)
export class MemberDTO extends UserInfoDTO {
  isOnline!: boolean;
}
