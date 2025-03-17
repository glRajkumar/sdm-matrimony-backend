import 'dotenv/config';

export const env = {
  MONGODB_URL: process.env.MONGODB_URL || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  FRONTEND_URL: process.env.FRONTEND_URL || "",
  NODE_ENV: process.env.NODE_ENV || "",

  GMAIL_PASS: process.env.GMAIL_PASS || "",
  GMAIL_ID: process.env.GMAIL_ID || "",
} as const

export const tokenEnums = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const
