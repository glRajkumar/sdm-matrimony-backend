import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(18, "Password must be at most 18 characters"),
  role: z.enum(["user", "admin"]).optional(),
})
