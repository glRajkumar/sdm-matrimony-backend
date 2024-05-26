import { FastifyInstance } from 'fastify';
import { registerUser, loginUser } from '../controllers/user.js';
import { createUserSchema, loginUserSchema } from '../schemas/user.js';

async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: createUserSchema }, registerUser);
  fastify.post('/login', { schema: loginUserSchema }, loginUser);
}

export default userRoutes;
