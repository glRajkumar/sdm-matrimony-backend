import { Hono } from 'hono';

import { createUsers, getUsers, getMarriedUsers, updateUser, userMarriedTo } from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin"]))

adminRoutes
  .get('/users', getUsers)
  .get('/users/married', getMarriedUsers)
  .post('/users', createUsers)
  .post('/user/married-to', userMarriedTo)
  .put('/user', updateUser)

export default adminRoutes
