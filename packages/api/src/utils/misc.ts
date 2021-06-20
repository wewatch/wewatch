import { customAlphabet } from "nanoid";

export const generateUsername = (type: string): string => {
  const nanoid = customAlphabet("0123456789ABCDEF", 8);
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}-${nanoid()}`;
};
