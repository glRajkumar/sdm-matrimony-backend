import { Hono } from 'hono';

import { createOrder, verifyPayment } from '../controllers/payment.js';
import authMiddleware from '../middlewares/auth.js';

const paymentRoutes = new Hono()

paymentRoutes.use(authMiddleware)

paymentRoutes
  .post('/create-order', createOrder)
  .post('/verify', verifyPayment)

export default paymentRoutes
