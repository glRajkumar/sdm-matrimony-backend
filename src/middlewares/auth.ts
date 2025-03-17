import { JwtTokenExpired } from 'hono/utils/jwt/types';
import { createMiddleware } from 'hono/factory';

import { tokenEnums, verifyToken } from '../utils/index.js';
import Admin from '../models/admin.js';
import User from '../models/user.js';

const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const token = c.req.header("Authorization")?.replace('Bearer ', '')
    if (!token) return c.json({ message: 'No token provided' }, 400)

    const { _id, role, type } = await verifyToken(token, tokenEnums.accessToken)

    if (type !== "access") return c.json({ message: 'Invalid token' }, 400)

    const Model = role === "user" ? User : Admin
    const user = await (Model as any).findById(_id).select("_id role isBlocked isDeleted").lean()
    if (!user) return c.json({ message: 'User not found' }, 400)

    if (user.role === "user" && (user.isDeleted || user.isBlocked)) return c.json({ message: 'Access denied' }, 400)

    c.set("user", { _id, role })

    await next()

  } catch (error) {
    if (error instanceof JwtTokenExpired) {
      return c.json({ message: "Token expired" }, 401)
    }
    return c.json({ message: "Invalid token" }, 400)
  }
})

export default authMiddleware
