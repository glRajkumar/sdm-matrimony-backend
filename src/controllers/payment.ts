import type { Context } from 'hono';
import Razorpay from 'razorpay';

import { env, planPrices, planValidityMonths, type plansT } from '../utils/enums.js';
import Payment from '../models/payment.js';
import User from '../models/user.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_SECRET,
})

export const createOrder = async (c: Context) => {
  const { _id } = c.get("user")
  const { subscribedTo } = await c.req.json()

  const options = {
    amount: planPrices[subscribedTo as plansT] * 100,
    currency: "INR",
    notes: {
      user_id: _id,
      subscribedTo: subscribedTo || "basic",
    }
  }

  const order = await razorpay.orders.create(options)
  return c.json(order)
}

export const verifyPayment = async (c: Context) => {
  const { _id } = c.get("user")
  const body = await c.req.json()

  const expiryDate = new Date(Date.now() + planValidityMonths[body.subscribedTo as plansT] * 24 * 60 * 60 * 1000)
  const payment = await Payment.create({
    ...body,
    user: _id,
    amount: planPrices[body.subscribedTo as plansT],
    expiryDate,
  })

  await User.updateOne({ _id }, { currentPlan: payment._id })

  return c.json({ message: "Payment verified successfully" })
}
