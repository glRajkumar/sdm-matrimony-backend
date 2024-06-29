import "fastify";
import { UserType } from "../schemas/user.ts";

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      MONGODB_URL: string;
      jwtSecretKey: string;
      CLOUDINARY_API_SECRET:string;
      CLOUDINARY_CLOUD_NAME:string;
      CLOUDINARY_API_KEY:string;
    };
    auth: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: UserType | null
    token: string | null
  }
}
