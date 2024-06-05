import { FastifyInstance } from 'fastify';
import { registerShcema } from '../schemas/user.js';
import { register } from '../controllers/user.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: registerShcema }, register);
}

export default userRoutes;
