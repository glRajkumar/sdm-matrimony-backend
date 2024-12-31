import { Hono } from 'hono';

import { login, logout, me, register, forgetPass, resetPass } from '../controllers/account.js';
import authMiddleware from '../middlewares/auth.js';

const accountRoutes = new Hono()

accountRoutes
  .post('/register', register)
  .post('/login', login)
  .post("/forgot-pass", forgetPass)
  .post("/reset-pass", resetPass)

accountRoutes.use(authMiddleware)

accountRoutes
  .get('/me', me)
  .post('/logout', logout)

export default accountRoutes
