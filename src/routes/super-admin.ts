import { Hono } from 'hono';

import {
  getPaidUsers, getAssistedSubscribedUsers, getUsersAllPayments,
  getUsersByCreatedBy, getUserCreationStatsPerAdmin,
  getUserCreationStatsToday, getAdmins, createAdmin,
  updateAdmin,
} from '../controllers/super-admin.js';

import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const superAdminRoutes = new Hono()

superAdminRoutes.use(authMiddleware)
superAdminRoutes.use(roleCheck(["super-admin"]))

superAdminRoutes
  .get('/users/paid', getPaidUsers)
  .get('/users/assisted-subscribed', getAssistedSubscribedUsers)
  .get('/users/all-payments', getUsersAllPayments)
  .get('/users/created-by', getUsersByCreatedBy)
  .get('/users-stats/created-per-admin', getUserCreationStatsPerAdmin)
  .get('/users-stats/created-today', getUserCreationStatsToday)
  .get('/admins', getAdmins)
  .post('/admin', createAdmin)
  .put('/admin/:_id', updateAdmin)

export default superAdminRoutes
