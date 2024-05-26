import { FastifyRequest } from "fastify";

export type reqRegister = FastifyRequest<{
  Body: {
    fullName: string
    email: string
    password: string
    role?: "user" | "admin" | "broker"
  }
}>

