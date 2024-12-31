import { Hono } from 'hono';

import { getPendingList, updateApproval } from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin"]))

adminRoutes
  .get('/pending-user-list', getPendingList)
  .put('/approval', updateApproval)

export default adminRoutes
