import { FastifyInstance } from 'fastify';
import { registerSchema } from '../schemas/user.js';
import { register } from '../controllers/user.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: registerSchema }, register);
}

export default userRoutes;
