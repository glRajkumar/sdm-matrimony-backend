import fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import cors from '@fastify/cors';
import env from '@fastify/env';

import authenticator from './plugins/authenticator.js';
import connectDb from './plugins/connectDb.js';

import envOptions from './schemas/env.js';
import userRoutes from './routes/user.js';

const app = fastify()

app
  .register(env, envOptions)
  .register(cors)
  .register(fastifyPlugin(connectDb))
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
