import 'dotenv/config';

export const env = {
  MONGODB_URL: process.env.MONGODB_URL || "",
  REDIS_URL: process.env.REDIS_URL || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  FRONTEND_URL: process.env.FRONTEND_URL || "",
  NODE_ENV: process.env.NODE_ENV || "",

  EMAIL_ID: process.env.EMAIL_ID || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  EMAIL_HOST: process.env.EMAIL_HOST || "",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET || "",
} as const

export type token_types = "accessToken" | "verifyToken" | "refreshToken"
export const tokenEnums = {
  verifyToken: "verifyToken",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const

export const tokenValidity = {
  verifyToken: 60 * 15, // 15 min
  accessToken: 60 * 30, // 30 min
  refreshToken: 60 * 60 * 24 * 7, // 7 days
} as const

export const approvalStatuses = ["pending", "approved", "rejected"] as const
export const maritalStatuses = ["Single", "Divorced", "Widowed"] as const
export const genders = ["Male", "Female"] as const // "Other"
export const roles = ["user", "admin", "super-admin"] as const // "Other"

export const plans = ['basic', 'gold', 'diamond', 'platinum'] as const
export type plansT = typeof plans[number]

export const planValidityMonths: Record<plansT, number> = {
  basic: 3,
  gold: 6,
  diamond: 9,
  platinum: 12,
} as const

export const planPrices: Record<plansT, number> = {
  basic: 3_000,
  gold: 5_500,
  diamond: 8_500,
  platinum: 11_000,
} as const
