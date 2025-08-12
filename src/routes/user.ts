import { Hono } from "hono";

import {
  imgUpload, getUserDetails, getMatches, getLikesList,
  addLiked, removeLiked, updateProfile, imgDelete,
  getPartnerPreferences, getUnlockedProfiles, unlockProfile,
  getAccountInfo,
} from "../controllers/user.js";

import {
  _idParamSchema, imgUploadSchema, matchedUsersSchema, skipLimitSchema,
  updateProfileSchema, userIdSchema, zValidate,
} from "../validations/index.js";

import authMiddleware from "../middlewares/auth.js";

const userRoutes = new Hono()

userRoutes.use(authMiddleware)

userRoutes
  .get("/matches", zValidate("query", matchedUsersSchema), getMatches)
  .get("/account-info", getAccountInfo)
  .get("/likes-list", zValidate("query", skipLimitSchema), getLikesList)
  .get("/profile/:_id", zValidate("param", _idParamSchema), getUserDetails)
  .get("/partner-preferences", getPartnerPreferences)
  .get("/unlocked", getUnlockedProfiles)
  .post("/addliked", zValidate("json", userIdSchema), addLiked)
  .post("/removeliked", zValidate("json", userIdSchema), removeLiked)
  .post("/unlock", zValidate("json", _idParamSchema), unlockProfile)
  .put("/profile", zValidate("json", updateProfileSchema), updateProfile)
  .put("/images", zValidate("form", imgUploadSchema), imgUpload)
  .delete("/image/:_id", zValidate("param", _idParamSchema), imgDelete)

export default userRoutes
