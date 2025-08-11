import { Hono } from 'hono';

import {
  login, logout, me, register, forgetPass, resetPass,
  imgUpload, approvalStatusRefresh, accessToken,
  verifyAccount, resendVerifyEmail, updatePassword,
} from '../controllers/account.js';
import { loginSchema, zValidate } from '../validations/index.js';

import authMiddleware from '../middlewares/auth.js';

const accountRoutes = new Hono()

accountRoutes
  .post('/register', register)
  .post('/login', zValidate("json", loginSchema), login)
  .post('/access-token', accessToken)
  .post("/forgot-pass", forgetPass)
  .post("/reset-pass", resetPass)
  .post("/register-image", imgUpload)
  .post("/verify", verifyAccount)

accountRoutes.use(authMiddleware)

accountRoutes
  .get('/me', me)
  .get('/check-approval-status', approvalStatusRefresh)
  .post("/update-password", updatePassword)
  .post("/resend-verify-email", resendVerifyEmail)
  .post('/logout', logout)

export default accountRoutes
