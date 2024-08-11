import { FastifyInstance } from 'fastify';

import { _id } from '../schemas/base.js';
import {
  loginSchema,
  registerSchema,
  uploadSchema,
  genderSchema,
} from '../schemas/user.js';

import {
  login,
  logout,
  me,
  register,
  imgUpload,
  getUserDetails,
  getMatches,
} from '../controllers/user.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post('/register', { schema: { body: registerSchema } }, register)
    .post('/login', { schema: { body: loginSchema } }, login)
    .post('/logout', logout)

  fastify
    .get('/me', me)
    .get('/:_id', { schema: { params: _id } }, getUserDetails)
    .get('/matches/:gender', { schema: { params: genderSchema } }, getMatches)

  fastify.put(
    '/imgupload',
    {
      schema: uploadSchema,
      attachValidation: true,
      preValidation: async (request, reply) => {
        if (
          request.headers['content-type']?.startsWith('multipart/form-data')
        ) {
          return;
        }
        reply
          .code(400)
          .send({ error: 'Content-Type must be multipart/form-data' });
      },
    },
    imgUpload
  )
}

export default userRoutes
