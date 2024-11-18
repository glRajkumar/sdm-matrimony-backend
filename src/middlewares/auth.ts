import { createMiddleware } from 'hono/factory';

import { verifyToken } from '../utils/index.js';
import User from '../models/user.js';

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'No token provided' }, 400)

  const payload = await verifyToken(token)
  const _id = payload._id

  const user = await User.findById(_id).select("-password -__v").lean()
  if (!user) return c.json({ error: 'User not found' }, 400)

  const tokenIndex = user.token.indexOf(token)
  if (tokenIndex === -1) return c.json({ error: 'Invalid token' }, 401)

  c.set("user", user)
  c.set("token", token)

  await next()
})

export default authMiddleware
