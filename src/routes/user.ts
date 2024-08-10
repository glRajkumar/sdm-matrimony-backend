import { FastifyInstance } from 'fastify';

import {
  getPendingListShcema,
  getMatchesShcema,
  getUserDetailsShcema,
  loginShcema,
  registerShcema,
  updateApprovalSchema,
  uploadSchema,
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
    .post('/logout', logout);

  fastify
    .get('/me', me)
    .get('/:id', { schema: getUserDetailsShcema }, getUserDetails)
    .get('/matches/:gender', { schema: getMatchesShcema }, getMatches)
    .get(
      '/pending-user-list',
      { schema: getPendingListShcema },
      getPendingList
    );

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
  );
  fastify.put(
    '/get-approval',
    { schema: updateApprovalSchema },
    updateApproval
  );
}

export default userRoutes;
