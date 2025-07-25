import { Hono } from 'hono';

import { login, logout, me, register, forgetPass, resetPass, imgUpload, approvalStatusRefresh, accessToken } from '../controllers/account.js';
import authMiddleware from '../middlewares/auth.js';

const accountRoutes = new Hono()

accountRoutes
  .post('/register', register)
  .post('/login', login)
  .post('/access-token', accessToken)
  .post("/forgot-pass", forgetPass)
  .post("/reset-pass", resetPass)
  .post("/register-image", imgUpload)

accountRoutes.use(authMiddleware)

accountRoutes
  .get('/me', me)
  .get('/check-approval-status', approvalStatusRefresh)
  .post('/logout', logout)

export default accountRoutes
