import type { Context } from 'hono';
import Razorpay from 'razorpay';

import { env } from '../utils/enums.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_SECRET,
})

export const createOrder = async (c: Context) => {
  const { amount } = await c.req.json()

  const options = {
    amount: amount * 100,
    currency: "INR",
  }

  const order = await razorpay.orders.create(options)
  console.log(order)
  return c.json(order)
}

export const verifyPayment = async (c: Context) => {
  const body = await c.req.json()
  console.log(body)

  return c.json({ message: "Payment verified successfully" })
}
