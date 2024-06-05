import { FastifyRequest } from "fastify";

import { loginShcemaType, registerShcemaType } from "../schemas/user.js";

export type registerReq = FastifyRequest<{
  Body: registerShcemaType
}>

export type loginReq = FastifyRequest<{
  Body: loginShcemaType
}>
