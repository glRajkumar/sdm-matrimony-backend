import "fastify";

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      MONGODB_URL: string;
      jwtSecretKey: string;
    };
  }
}
