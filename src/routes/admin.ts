import { Hono } from 'hono';

import { getUsers, updateApproval } from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin"]))

adminRoutes
  .get('/users', getUsers)
  .put('/approval', updateApproval)

export default adminRoutes
