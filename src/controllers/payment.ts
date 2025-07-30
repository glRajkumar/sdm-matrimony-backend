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
  const {
    subscribedTo = "basic",
    noOfProfilesCanView = 50,
    isAssisted = false,
    assistedMonths = 0
  } = await c.req.json()

  let amount = planPrices[subscribedTo as plansT]

  const notes: any = {
    user_id: _id,
    subscribedTo,
    noOfProfilesCanView,
    isAssisted,
    assistedMonths,
  }

  if (noOfProfilesCanView > 50) {
    if (noOfProfilesCanView === 999) {
      // Unlimited
      amount += 20_000
    } else {
      amount += ((noOfProfilesCanView - 50) / 50) * 1_000
    }
  }

  if (isAssisted) {
    amount += assistedMonths * 10_000
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    notes,
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
    expiryDate,
  })

  await User.updateOne({ _id }, { currentPlan: payment._id })

  return c.json({ message: "Payment verified successfully" })
}
