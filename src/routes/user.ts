import { Hono } from 'hono';

import { login, logout, me, register, imgUpload, getUserDetails, getMatches } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const userRoutes = new Hono()

userRoutes
  .post('/register', register)
  .post('/login', login)
  .post('/logout', logout)

userRoutes.use(authMiddleware)

userRoutes
  .get('/me', me)
  .get('/:_id', getUserDetails)
  .get('/matches', getMatches)
  .put('/imgupload', imgUpload)

export default userRoutes
