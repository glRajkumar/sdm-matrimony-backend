import fastify from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import env from '@fastify/env';

import authenticator from './plugins/authenticator.js';
import connectDb from './plugins/connectDb.js';

import envOptions from './schemas/env.js';
import userRoutes from './routes/user.js';
import multer from 'fastify-multer';


const app = fastify()

app
  .register(env, envOptions)
  .register(cors)
  .register(fp(connectDb))
  .register(fp(authenticator))
  .register(userRoutes, { prefix: "/users" })
  .register(multer.contentParser);

const port = 5000
app.listen({ port }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${port}`)
})
