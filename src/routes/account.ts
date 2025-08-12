import { Hono } from "hono";

import {
  login, logout, me, register, forgetPass, resetPass,
  imgUpload, approvalStatusRefresh, accessToken,
  verifyAccount, resendVerifyEmail, updatePassword,
} from "../controllers/account.js";

import {
  registerSchema, loginSchema, refreshTokenSchema,
  forgotPassSchema, resetPassSchema, updatePasswordSchema,
  resendVerifyEmailSchema, verifyAccountSchema, registerImageSchema,
  zv,
} from "../validations/index.js";

import createRateLimiter from "../middlewares/rate-limit.js";
import authMiddleware from "../middlewares/auth.js";

const rl = createRateLimiter({ limit: 5, windowMs: 60 * 1000 })

const accountRoutes = new Hono()

accountRoutes
  .post("/login", rl, zv("json", loginSchema), login)
  .post("/register", rl, zv("json", registerSchema), register)
  .post("/access-token", rl, zv("cookie", refreshTokenSchema), accessToken)
  .post("/forgot-pass", rl, zv("json", forgotPassSchema), forgetPass)
  .post("/reset-pass", rl, zv("json", resetPassSchema), resetPass)
  .post("/register-image", rl, zv("form", registerImageSchema), imgUpload)
  .post("/verify", rl, zv("json", verifyAccountSchema), verifyAccount)

accountRoutes.use(authMiddleware)
accountRoutes.use(createRateLimiter())

accountRoutes
  .get("/me", me)
  .get("/check-approval-status", approvalStatusRefresh)
  .post("/update-password", zv("json", updatePasswordSchema), updatePassword)
  .post("/resend-verify-email", zv("json", resendVerifyEmailSchema), resendVerifyEmail)
  .post("/logout", zv("cookie", refreshTokenSchema), logout)

export default accountRoutes
