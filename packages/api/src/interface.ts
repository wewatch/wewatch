import { FastifyRequest } from "fastify";

import { User } from "modules/user/model";

export interface RequestWithUser extends FastifyRequest {
  user: User;
}
