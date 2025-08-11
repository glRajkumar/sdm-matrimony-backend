import { Hono } from "hono";

import {
  getPaidUsers, getAssistedSubscribedUsers, getUsersAllPayments,
  getUsersByCreatedBy, getUserCreationStatsPerAdmin,
  getUserCreationStatsToday, getAdmins, createAdmin,
  updateAdmin,
} from "../controllers/super-admin.js";

import {
  skipLimitSchema, adminCreateSchema, adminUpdateSchema, usersCreatedBySchema,
  _idParamSchema, zValidate,
} from "../validations/index.js";

import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/role-check.js";

const superAdminRoutes = new Hono()

superAdminRoutes.use(authMiddleware)
superAdminRoutes.use(roleCheck(["super-admin"]))

superAdminRoutes
  .get("/users/paid", zValidate("query", skipLimitSchema), getPaidUsers)
  .get("/users/assisted-subscribed", zValidate("query", skipLimitSchema), getAssistedSubscribedUsers)
  .get("/users/all-payments", zValidate("query", skipLimitSchema), getUsersAllPayments)
  .get("/users/created-by", zValidate("query", usersCreatedBySchema), getUsersByCreatedBy)
  .get("/users-stats/created-per-admin", getUserCreationStatsPerAdmin)
  .get("/users-stats/created-today", getUserCreationStatsToday)
  .get("/admins", getAdmins)
  .post("/admin", zValidate("json", adminCreateSchema), createAdmin)
  .put("/admin/:_id", zValidate("param", _idParamSchema), zValidate("json", adminUpdateSchema), updateAdmin)

export default superAdminRoutes
