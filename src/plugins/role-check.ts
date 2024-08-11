import { FastifyReply, FastifyRequest } from "fastify";
import { Static } from '@sinclair/typebox';
import { Role } from "../schemas/user.js";

type rolesT = Static<typeof Role>

function roleCheck(roles: rolesT[]) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as { role: rolesT };

    if (!roles.includes(user.role)) return res.code(403).send({ error: "Access denied" })
  }
}

export default roleCheck
