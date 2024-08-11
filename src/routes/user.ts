import { FastifyInstance } from 'fastify';

import {
  loginShcema,
  registerShcema,
  uploadSchema,
  _idSchema,
  genderShcema,
  approvalStatusShcema,
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
    .post('/register', { schema: registerShcema }, register)
    .post('/login', { schema: loginShcema }, login)
    .post('/logout', logout)

  fastify
    .get('/me', me)
    .get('/:_id', { schema: { params: _idSchema } }, getUserDetails)
    .get('/matches/:gender', { schema: { params: genderShcema } }, getMatches)
    .get('/pending-user-list', getPendingList)
    .put('/approval/:_id', { schema: { params: _idSchema, querystring: approvalStatusShcema } }, updateApproval)

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
