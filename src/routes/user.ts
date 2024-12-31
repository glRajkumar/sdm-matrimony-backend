import { Hono } from 'hono';

import { login, logout, me, register, imgUpload, getUserDetails, getMatches, forgetPass, resetPass } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const userRoutes = new Hono()

userRoutes
  .post('/register', register)
  .post('/login', login)
  .post("/forgot-pass", forgetPass)
  .post("/reset-pass", resetPass)

userRoutes.use(authMiddleware)

userRoutes
  .get('/me', me)
  .get('/matches', getMatches)
  .get('/:_id', getUserDetails)
  .put('/imgupload', imgUpload)
  .post('/logout', logout)

export default userRoutes
