import { FastifyInstance } from "fastify";
import jwt from '@fastify/jwt';

async function authenticator(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: fastify.config.jwtSecretKey
  })
}

export default authenticator
