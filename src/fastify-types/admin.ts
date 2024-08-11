import { FastifyRequest } from 'fastify';
import { Static } from '@sinclair/typebox';

import { approvalStatusSchema } from '../schemas/user.js';
import { _id } from '../schemas/base.js';

export type updateApprovalReq = FastifyRequest<{
  Params: Static<typeof _id>
  Querystring: Static<typeof approvalStatusSchema>
}>
