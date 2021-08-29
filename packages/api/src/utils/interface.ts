import { FastifyRequest } from "fastify";

import { UserDocument } from "modules/user";

export interface RequestWithUser extends FastifyRequest {
  user: UserDocument;
}
