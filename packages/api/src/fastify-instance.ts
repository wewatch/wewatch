import { fastify, FastifyInstance } from "fastify";
import fastifyHelmet from "fastify-helmet";
import fp from "fastify-plugin";

export const fastifyInstance = fastify();

fastifyInstance.register(fastifyHelmet);

fastifyInstance.register(
  fp(async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (req, reply) => {
      reply.headers({
        "Surrogate-Control": "no-store",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
    });
  }),
);
