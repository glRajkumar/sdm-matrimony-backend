import { z } from "zod";

import { adminSchema, approvalStatusEnum, emailSchema, mobileSchema, passwordSchema } from "./general.js";

export const usersCreatedBySchema = z.object({
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(10),
  createdAtToday: z.coerce.boolean().optional(),
  createdBy: z.string().optional(),
}).optional()

export const adminCreateSchema = adminSchema
  .omit({ role: true })
  .safeExtend({
    role: z.literal("admin").optional(),
  })
  .refine(
    (data) => !!data.email || !!data.contactDetails?.mobile,
    {
      message: "Either email or mobile is required",
      path: ["email"],
    }
  )


export const adminUpdateSchema = adminSchema
  .omit({ role: true, password: true })
  .safeExtend({
    role: z.literal("admin").optional(),
    password: passwordSchema.optional(),
    approvalStatus: approvalStatusEnum.optional(),
    isDeleted: z.boolean().optional(),
  })