import { Hono } from 'hono';

import { imgUpload, getUserDetails, getMatches, getLikesList, addLiked, removeLiked, updateProfile } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const userRoutes = new Hono()

userRoutes.use(authMiddleware)

userRoutes
  .get('/matches', getMatches)
  .get('/likes-list', getLikesList)
  .get('/profile/:_id', getUserDetails)
  .post('/addliked', addLiked)
  .post('/removeliked', removeLiked)
  .put('/profile', updateProfile)
  .put('/imgupload', imgUpload)

export default userRoutes
