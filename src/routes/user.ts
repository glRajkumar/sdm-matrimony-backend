import { FastifyInstance } from 'fastify';

import { _id } from '../schemas/base.js';
import {
  loginSchema,
  registerSchema,
  uploadSchema,
  genderSchema,
  approvalStatusSchema,
} from '../schemas/user.js';

import {
  login,
  logout,
  me,
  register,
  imgUpload,
  getUserDetails,
  getMatches,
  getPendingList,
  updateApproval,
} from '../controllers/user.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post('/register', { schema: { body: registerSchema } }, register)
    .post('/login', { schema: { body: loginSchema } }, login)
    .post('/logout', logout)

  fastify
    .get('/me', me)
    .get('/pending-user-list', getPendingList)
    .get('/:_id', { schema: { params: _id } }, getUserDetails)
    .get('/matches/:gender', { schema: { params: genderSchema } }, getMatches)
    .put('/approval/:_id', { schema: { params: _id, querystring: approvalStatusSchema } }, updateApproval)

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

export default userRoutes;
