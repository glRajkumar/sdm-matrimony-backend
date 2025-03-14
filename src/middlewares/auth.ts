import { createMiddleware } from 'hono/factory';

import { verifyToken } from '../utils/index.js';
import Admin from '../models/admin.js';
import User from '../models/user.js';

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.replace('Bearer ', '')
  if (!token) return c.json({ message: 'No token provided' }, 400)

  const { _id, role, type } = await verifyToken(token, "access_token")

  if (type !== "access") return c.json({ message: 'Invalid token' }, 400)

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findById(_id).select("_id role isBlocked isDeleted").lean()
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (user.role === "user" && (user.isDeleted || user.isBlocked)) return c.json({ message: 'Access denied' }, 400)

  c.set("user", { _id, role })

  await next()
})

export default authMiddleware
