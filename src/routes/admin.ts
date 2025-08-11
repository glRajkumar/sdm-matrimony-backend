import { Hono } from "hono";

import {
  createUsers, getUsers, getMarriedUsers,
  updateUser, userMarriedTo, findUser,
} from "../controllers/admin.js";

import {
  findUsersSchema, findUserSchema, skipLimitSchema,
  createUsersSchema, userMarriedToSchema, updateUserSchema,
  zValidate,
} from "../validations/index.js";

import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/role-check.js";

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin", "super-admin"]))

adminRoutes
  .get("/users", zValidate("query", findUsersSchema), getUsers)
  .get("/users/married", zValidate("query", skipLimitSchema), getMarriedUsers)
  .get("/user/find", zValidate("query", findUserSchema), findUser)
  .post("/users", zValidate("json", createUsersSchema), createUsers)
  .post("/user/married-to", zValidate("json", userMarriedToSchema), userMarriedTo)
  .put("/user", zValidate("json", updateUserSchema), updateUser)

export default adminRoutes
