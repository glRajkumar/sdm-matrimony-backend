import { createMiddleware } from 'hono/factory';

import { verifyToken } from '../utils/index.js';
import Admin from '../models/admin.js';
import User from '../models/user.js';

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.replace('Bearer ', '')
  if (!token) return c.json({ message: 'No token provided' }, 400)

  const payload = await verifyToken(token)
  const role = payload.role
  const _id = payload._id

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findById(_id).select("_id role token").lean()
  if (!user) return c.json({ message: 'User not found' }, 400)

  const tokenIndex = user.token.indexOf(token)
  if (tokenIndex === -1) return c.json({ message: 'Invalid token' }, 401)

  c.set("user", { _id, role })
  c.set("token", token)

  await next()
})

export default authMiddleware
