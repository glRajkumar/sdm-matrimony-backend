import { FastifyInstance } from "fastify";

import { loginShcema, registerShcema, uploadSchema } from "../schemas/user.js";

import {
  login,
  logout,
  me,
  register,
  imgUpload,
  getUsers,
  getUser
} from "../controllers/user.js";

async function userRoutes(fastify: FastifyInstance) {
  fastify
    .post("/register", { schema: registerShcema }, register)
    .post("/login", { schema: loginShcema }, login)
    .get("/me", { schema: registerShcema }, me)
    .post("/logout", { schema: registerShcema }, logout)
    .get("/getusers", getUsers)
    .get("/getuser/:id", { schema: registerShcema }, getUser)

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

export default userRoutes;
