import { FastifyRequest } from "fastify";

import { registerShcemaType } from "../schemas/user.js";

export type registerReq = FastifyRequest<{
  Body: registerShcemaType
}>
