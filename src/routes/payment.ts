import { Hono } from 'hono';

import { zValidate, createOrderSchema, verifyPaymentSchema } from '../validations/index.js';
import { createOrder, verifyPayment } from '../controllers/payment.js';
import authMiddleware from '../middlewares/auth.js';

const paymentRoutes = new Hono()

paymentRoutes.use(authMiddleware)

paymentRoutes
  .post('/create-order', zValidate("json", createOrderSchema), createOrder)
  .post('/verify', zValidate("json", verifyPaymentSchema), verifyPayment)

export default paymentRoutes
