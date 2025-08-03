import { Hono } from 'hono';

import {
  createUsers, getUsers, getMarriedUsers, updateUser,
  userMarriedTo, findUser, getPaidUsers,
  getAssistedSubscribedUsers, getUsersAllPayments
} from '../controllers/admin.js';

import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const adminRoutes = new Hono()

adminRoutes.use(authMiddleware)
adminRoutes.use(roleCheck(["admin"]))

adminRoutes
  .get('/users', getUsers)
  .get('/users/married', getMarriedUsers)
  .get('/user/find', findUser)
  .get('/users/paid', getPaidUsers)
  .get('/users/assisted-subscribed', getAssistedSubscribedUsers)
  .get('/users/all-payments', getUsersAllPayments)
  .post('/users', createUsers)
  .post('/user/married-to', userMarriedTo)
  .put('/user', updateUser)

export default adminRoutes
