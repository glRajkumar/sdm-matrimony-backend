import "@fastify/jwt";
import { RoleType, UserType } from '../schemas/user.ts';

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { _id: string, role: RoleType }
    user: UserType
  }
}
