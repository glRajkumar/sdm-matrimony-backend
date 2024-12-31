import { Hono } from 'hono';

import { imgUpload, getUserDetails, getMatches } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const userRoutes = new Hono()

userRoutes.use(authMiddleware)

userRoutes
  .get('/matches', getMatches)
  .get('/:_id', getUserDetails)
  .put('/imgupload', imgUpload)

export default userRoutes
