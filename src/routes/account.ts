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
  zValidate,
} from "../validations/index.js";

import authMiddleware from "../middlewares/auth.js";

const accountRoutes = new Hono()

accountRoutes
  .post("/login", zValidate("json", loginSchema), login)
  .post("/register", zValidate("json", registerSchema), register)
  .post("/access-token", zValidate("cookie", refreshTokenSchema), accessToken)
  .post("/forgot-pass", zValidate("json", forgotPassSchema), forgetPass)
  .post("/reset-pass", zValidate("json", resetPassSchema), resetPass)
  .post("/register-image", zValidate("form", registerImageSchema), imgUpload)
  .post("/verify", zValidate("json", verifyAccountSchema), verifyAccount)

accountRoutes.use(authMiddleware)

accountRoutes
  .get("/me", me)
  .get("/check-approval-status", approvalStatusRefresh)
  .post("/update-password", zValidate("json", updatePasswordSchema), updatePassword)
  .post("/resend-verify-email", zValidate("json", resendVerifyEmailSchema), resendVerifyEmail)
  .post("/logout", zValidate("cookie", refreshTokenSchema), logout)

export default accountRoutes
