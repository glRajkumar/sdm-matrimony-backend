import { FastifyEnvOptions } from "@fastify/env";

const envSchema = {
  type: "object",
  required: ["MONGODB_URL", "jwtSecretKey", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
  properties: {
    MONGODB_URL: { type: "string" },
    jwtSecretKey: { type: "string" },
    CLOUDINARY_CLOUD_NAME: { type: "string" },
    CLOUDINARY_API_KEY: { type: "string" },
    CLOUDINARY_API_SECRET: { type: "string" },
  },
  additionalProperties: false,
};

const envOptions: FastifyEnvOptions = {
  schema: envSchema,
  dotenv: true,
};

export default envOptions;
