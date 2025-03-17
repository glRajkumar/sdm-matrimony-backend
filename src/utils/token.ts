import { sign, verify } from "hono/jwt";
import { env } from "./enums.js";

type token_types = "access_token" | "refresh_token"
export async function getToken(data: Record<string, string | number | boolean>, type: token_types) {
  const isAccessToken = type === "access_token"
  const secret = isAccessToken ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET

  const payload = {
    exp: isAccessToken
      ? Math.floor(Date.now() / 1000) + (60 * 30) // 30 min
      : Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    type: isAccessToken ? "access" : "refresh",
    ...data,
  }

  return await sign(payload, secret)
}

export async function verifyToken(token: string, type: token_types) {
  const isAccessToken = type === "access_token"
  const secret = isAccessToken ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET

  return verify(token, secret)
}
