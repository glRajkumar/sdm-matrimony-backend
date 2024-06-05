import "fastify";
import { UserType } from "../schemas/user.ts";

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      MONGODB_URL: string;
      jwtSecretKey: string;
    };
    auth: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: UserType | null
  }
}
