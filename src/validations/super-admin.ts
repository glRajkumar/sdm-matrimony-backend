import { z } from "zod";

import { adminSchema, approvalStatusEnum, passwordSchema } from "./general.js";

export const usersCreationsStatsSchema = z.object({
  date: z.string({ error: "Date is required" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
})

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