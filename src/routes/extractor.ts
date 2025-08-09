import { Hono } from 'hono';

import { extractImg } from '../controllers/extractor.js';
import authMiddleware from '../middlewares/auth.js';
import roleCheck from '../middlewares/role-check.js';

const extractorRoutes = new Hono()

extractorRoutes.use(authMiddleware)
extractorRoutes.use(roleCheck(["admin", "super-admin"]))

extractorRoutes
  .post('/', extractImg)

export default extractorRoutes
