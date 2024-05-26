import { FastifyEnvOptions } from '@fastify/env';

const envSchema = {
  type: 'object',
  required: ['MONGODB_URL', 'jwtSecretKey'],
  properties: {
    MONGODB_URL: { type: 'string' },
    jwtSecretKey: { type: 'string' },
  },
  additionalProperties: false
}

const envOptions: FastifyEnvOptions = {
  schema: envSchema,
  dotenv: true,
}

export default envOptions
