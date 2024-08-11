import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";

import User from "../models/User.js";

async function authenticator(fastify: FastifyInstance) {
  const publicRoutes = ["/users/register", "/users/login"]

  fastify.register(jwt, {
    secret: fastify.config.jwtSecretKey,
  })

  fastify.decorate("auth", async function (req: FastifyRequest, res: FastifyReply) {
    try {
      if (publicRoutes.includes(req.url)) return

      const token = req.headers.authorization?.replace("Bearer ", "")
      if (!token) return res.status(401).send("Authorization header is missing")

      const payload: any = fastify.jwt.verify(token)
      const userId = payload?._id

      const user = await User.findById(userId).lean()
      if (!user) return res.code(400).send("User was not found")

      const tokenIndex = user.token.indexOf(token)
      if (tokenIndex < 0) return res.code(401).send("Token not found in db")

      req.user = user
      req.token = token
    } catch (error) {
      return res.code(400).send("Auth token invalid")
    }
  })

  fastify.addHook("onRequest", fastify.auth)
}

export default authenticator
