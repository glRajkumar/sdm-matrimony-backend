import { FastifyRequest } from 'fastify';

import {
  getPendingListShcemaType,
  getMatchesShcemaType,
  getUserDetailsShcemaType,
  loginShcemaType,
  registerShcemaType,
  uploadSchemaType,
  updateApproval,
} from '../schemas/user.js';

export type registerReq = FastifyRequest<{
  Body: registerShcemaType;
}>;

export type loginReq = FastifyRequest<{
  Body: loginShcemaType;
}>;

export type uploadReq = FastifyRequest<{
  Body: uploadSchemaType;
}>;

export type getUserDetailsReq = FastifyRequest<{
  Params: getUserDetailsShcemaType;
}>;

export type getMatchesReq = FastifyRequest<{
  Params: getMatchesShcemaType;
}>;

export type getPendingListReq = FastifyRequest<{
  Body: getPendingListShcemaType;
}>;

export type updateApprovalReq = FastifyRequest<{
  Params: updateApproval;
  Querystring: updateApproval;
}>;
