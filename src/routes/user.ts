import { Hono } from 'hono';

import {
  imgUpload, getUserDetails, getMatches, getLikesList,
  addLiked, removeLiked, updateProfile, imgDelete,
  getPartnerPreferences, getUnlockedProfiles, unlockProfile,
  getAccountInfo,
} from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const userRoutes = new Hono()

userRoutes.use(authMiddleware)

userRoutes
  .get('/matches', getMatches)
  .get('/account-info', getAccountInfo)
  .get('/likes-list', getLikesList)
  .get('/profile/:_id', getUserDetails)
  .get('/partner-preferences', getPartnerPreferences)
  .get('/unlocked', getUnlockedProfiles)
  .post('/addliked', addLiked)
  .post('/removeliked', removeLiked)
  .post('/unlock', unlockProfile)
  .put('/profile', updateProfile)
  .put('/images', imgUpload)
  .delete('/image/:_id', imgDelete)

export default userRoutes
