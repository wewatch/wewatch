import type { FastifyRequest } from "fastify";
import { customAlphabet } from "nanoid";

import { UserType } from "@/constants";

export const generateUsername = (type: UserType): string => {
  const nanoid = customAlphabet("0123456789ABCDEF", 8);
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}-${nanoid()}`;
};

export const getClientIP = (request: FastifyRequest): string => {
  const cfConnectingIP = request.headers["cf-connecting-ip"];
  if (typeof cfConnectingIP === "string") {
    return cfConnectingIP;
  } else if (Array.isArray(cfConnectingIP)) {
    return cfConnectingIP[0];
  }

  return request.ip;
};
