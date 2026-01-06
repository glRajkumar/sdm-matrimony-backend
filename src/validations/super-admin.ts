import { z } from "zod";

import { approvalStatusEnum, passwordSchema, emailSchema, mobileSchema } from "./general.js";

export const usersGroupedByAdminCountSchema = z.object({
  type: z.enum(["date", "caste"], { error: "Type must be either date or caste" }).default("date").optional(),
})

export const usersGroupedCountSchema = z.object({
  date: z.string({ error: "Date is required" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  caste: z.string().optional(),
})

export const usersGroupedListSchema = usersGroupedCountSchema.safeExtend({
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(50),
  createdBy: z.string().optional(),
})

export const usersCreatedBySchema = z.object({
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(50),
  createdAtToday: z.coerce.boolean().optional(),
  createdBy: z.string().optional(),
}).optional()

export const adminCreateSchema = z.object({
  role: z.literal("admin").optional(),
  fullName: z.string("Name is required").min(3, "Name must be at least 3 characters"),
  email: emailSchema.optional(),
  password: passwordSchema,
  contactDetails: z.object({
    mobile: mobileSchema.optional(),
    address: z.string().optional(),
  }).optional(),
})
  .refine(
    (data) => !!data.email || !!data.contactDetails?.mobile,
    {
      message: "Either email or mobile is required",
      path: ["email"],
    }
  )

export const adminUpdateSchema = z.object({
  fullName: z.string("Name is required").min(3, "Name must be at least 3 characters"),
  email: emailSchema.optional(),
  contactDetails: z.object({
    mobile: mobileSchema.optional(),
    address: z.string().optional(),
  }).optional(),
  role: z.literal("admin").optional(),
  password: passwordSchema.optional(),
  approvalStatus: approvalStatusEnum.optional(),
  isDeleted: z.boolean().optional(),
})
  .refine(
    (data) => !!data.email || !!data.contactDetails?.mobile,
    {
      message: "Either email or mobile is required",
      path: ["email"],
    }
  )

export const resetPassByAdminSchema = z.object({
  password: passwordSchema,
})