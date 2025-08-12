import { Hono } from 'hono';

import { zv, createOrderSchema, verifyPaymentSchema } from '../validations/index.js';
import { createOrder, verifyPayment } from '../controllers/payment.js';
import authMiddleware from '../middlewares/auth.js';

const paymentRoutes = new Hono()

paymentRoutes.use(authMiddleware)

paymentRoutes
  .post('/create-order', zv("json", createOrderSchema), createOrder)
  .post('/verify', zv("json", verifyPaymentSchema), verifyPayment)

export default paymentRoutes
