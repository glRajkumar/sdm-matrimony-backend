import fastify, { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import cors from '@fastify/cors';
import env from '@fastify/env';
import jwt from '@fastify/jwt';

import envOptions from './schemas/env.js';
import userRoutes from './routes/user.js';

const app = fastify()

async function authenticator(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: fastify.config.jwtSecretKey
  })
}

app
  .register(env, envOptions)
  .register(cors)
  .register(fastifyPlugin(authenticator))
  .register(userRoutes, { prefix: "/users" })

const port = 5000
app.listen({ port }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${port}`)
})
