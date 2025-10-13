import { Hono } from "hono";

import {
  getPaidUsers, getAssistedSubscribedUsers, getUsersAllPayments,
  getUsersByCreatedBy, getUserCreationStatsPerAdmin,
  getUserCreationStats, getAdmins, createAdmin,
  updateAdmin, getNotInvitedUsers, updateInvited,
} from "../controllers/super-admin.js";

import {
  skipLimitSchema, adminCreateSchema, adminUpdateSchema, usersCreatedBySchema,
  _idParamSchema, zv, usersCreationsStatsSchema,
} from "../validations/index.js";

import roleCheck from "../middlewares/role-check.js";

const superAdminRoutes = new Hono()

superAdminRoutes.use(roleCheck(["super-admin"]))

superAdminRoutes
  .get("/users/paid", zv("query", skipLimitSchema), getPaidUsers)
  .get("/users/assisted-subscribed", zv("query", skipLimitSchema), getAssistedSubscribedUsers)
  .get("/users/all-payments", zv("query", skipLimitSchema), getUsersAllPayments)
  .get("/users/created-by", zv("query", usersCreatedBySchema), getUsersByCreatedBy)
  .get("/users-stats/created-per-admin", getUserCreationStatsPerAdmin)
  .get("/users-stats/created", zv("query", usersCreationsStatsSchema), getUserCreationStats)
  .get("/admins", getAdmins)
  .get("/users/not-invited", zv("query", skipLimitSchema), getNotInvitedUsers)
  .post("/admin", zv("json", adminCreateSchema), createAdmin)
  .put("/admin/:_id", zv("param", _idParamSchema), zv("json", adminUpdateSchema), updateAdmin)
  .put("/user/invite/:_id", zv("param", _idParamSchema), updateInvited)

export default superAdminRoutes
