import { FastifyRequest } from 'fastify';

import {
  _idShcemaType,
  approvalStatusShcemaType,
  genderShcemaType,
  loginShcemaType,
  registerShcemaType,
  uploadSchemaType,
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
  Params: _idShcemaType;
}>;

export type getMatchesReq = FastifyRequest<{
  Params: genderShcemaType;
}>;

export type updateApprovalReq = FastifyRequest<{
  Params: _idShcemaType;
  Querystring: approvalStatusShcemaType;
}>;
