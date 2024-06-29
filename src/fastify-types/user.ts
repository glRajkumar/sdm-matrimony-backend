import { FastifyRequest } from "fastify";

import { loginShcemaType, registerShcemaType, uploadSchemaType } from "../schemas/user.js";

export type registerReq = FastifyRequest<{
  Body: registerShcemaType
}>

export type loginReq = FastifyRequest<{
  Body: loginShcemaType
}>

export type uploadReq = FastifyRequest<{
  Body: uploadSchemaType,
  File:uploadSchemaType,
}>


