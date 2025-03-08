import type { ConfigOptions } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { sign, verify } from "hono/jwt";
import 'dotenv/config';

export const env = {
  MONGODB_URL: process.env.MONGODB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "",
}

export function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000)
  console.log(otp)
  return otp
}

export async function getToken(data: Record<string, string | number | boolean>) {
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1),
  }
  const secret = env.JWT_SECRET
  const newToken = await sign(payload, secret)
  return newToken
}

export async function verifyToken(token: string) {
  return verify(token, env.JWT_SECRET)
}

export function getCloudinary() {
  const config: ConfigOptions = {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY,
    secure: true,
  }

  cloudinary.config(config)

  return cloudinary
}