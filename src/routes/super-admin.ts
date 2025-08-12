import { Hono } from "hono";

import {
  getPaidUsers, getAssistedSubscribedUsers, getUsersAllPayments,
  getUsersByCreatedBy, getUserCreationStatsPerAdmin,
  getUserCreationStatsToday, getAdmins, createAdmin,
  updateAdmin,
} from "../controllers/super-admin.js";

import {
  skipLimitSchema, adminCreateSchema, adminUpdateSchema, usersCreatedBySchema,
  _idParamSchema, zv,
} from "../validations/index.js";

import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/role-check.js";

const superAdminRoutes = new Hono()

superAdminRoutes.use(authMiddleware)
superAdminRoutes.use(roleCheck(["super-admin"]))

superAdminRoutes
  .get("/users/paid", zv("query", skipLimitSchema), getPaidUsers)
  .get("/users/assisted-subscribed", zv("query", skipLimitSchema), getAssistedSubscribedUsers)
  .get("/users/all-payments", zv("query", skipLimitSchema), getUsersAllPayments)
  .get("/users/created-by", zv("query", usersCreatedBySchema), getUsersByCreatedBy)
  .get("/users-stats/created-per-admin", getUserCreationStatsPerAdmin)
  .get("/users-stats/created-today", getUserCreationStatsToday)
  .get("/admins", getAdmins)
  .post("/admin", zv("json", adminCreateSchema), createAdmin)
  .put("/admin/:_id", zv("param", _idParamSchema), zv("json", adminUpdateSchema), updateAdmin)

export default superAdminRoutes
