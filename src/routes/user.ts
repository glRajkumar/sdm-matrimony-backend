import { FastifyInstance } from "fastify";

import { getMatchesShcema, getUserDetailsShcema, loginShcema, registerShcema, uploadSchema } from "../schemas/user.js";

import {
  login, logout, me, register, imgUpload,
  getUserDetails, getMatches
} from "../controllers/user.js";

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post("/register", { schema: registerShcema }, register)
    .post("/login", { schema: loginShcema }, login)
    .post("/logout", logout)

  fastify
    .get("/me", me)
    .get("/:id", { schema: getUserDetailsShcema }, getUserDetails)
    .get("/matches/:gender", { schema: getMatchesShcema }, getMatches)

  fastify.put("/imgupload", {
    schema: uploadSchema,
    attachValidation: true,
    preValidation: async (request, reply) => {
      if (request.headers['content-type']?.startsWith('multipart/form-data')) {
        return
      }
      reply.code(400).send({ error: 'Content-Type must be multipart/form-data' })
    }
  }, imgUpload)
}

export default userRoutes
