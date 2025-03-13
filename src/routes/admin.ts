import { Hono } from 'hono';

import { createUsers, getUsers, updateUser } from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin"]))

adminRoutes
  .get('/users', getUsers)
  .post('/users', createUsers)
  .put('/user', updateUser)

export default adminRoutes
