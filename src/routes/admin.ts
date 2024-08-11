import { FastifyInstance } from 'fastify';

import roleCheck from '../plugins/role-check.js';

import { approvalStatusSchema } from '../schemas/user.js';
import { _id } from '../schemas/base.js';

import { getPendingList, updateApproval } from '../controllers/admin.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', roleCheck(['admin']))

  fastify
    .get('/pending-user-list', getPendingList)
    .put('/approval/:_id', { schema: { params: _id, querystring: approvalStatusSchema } }, updateApproval)
}

export default userRoutes;
