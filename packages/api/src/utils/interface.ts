import { FastifyRequest } from "fastify";

import { User } from "modules/user";

export interface RequestWithUser extends FastifyRequest {
  user: User;
}
