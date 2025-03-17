import { sign, verify } from "hono/jwt";

import { env, tokenEnums, tokenValidity } from "./enums.js";

type token_types = (typeof tokenEnums)[keyof typeof tokenEnums]
export async function getToken(data: Record<string, string | number | boolean>, type: token_types) {
  const isAccessToken = type === tokenEnums.accessToken
  const secret = isAccessToken ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET

  const payload = {
    exp: isAccessToken
      ? Math.floor(Date.now() / 1000) + tokenValidity.accessToken
      : Math.floor(Date.now() / 1000) + tokenValidity.refreshToken,
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
