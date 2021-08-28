import { customAlphabet } from "nanoid";

import { UserType } from "@/constants";

export const generateUsername = (type: UserType): string => {
  const nanoid = customAlphabet("0123456789ABCDEF", 8);
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}-${nanoid()}`;
};
