import type { Context } from 'hono';
import Razorpay from 'razorpay';

import { env, planPrices, planValidityMonths, type plansT } from '../utils/enums.js';
import { Payment, User } from '../models/index.js';
import { redisClient } from '../services/connect-redis.js';

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
  const { _id, role } = c.get("user")
  const body = await c.req.json()

  if (!body.isAssisted) {
    body.assistedMonths = 0
  }

  const expiryDate = new Date(Date.now() + planValidityMonths[body.subscribedTo as plansT] * 24 * 60 * 60 * 1000)
  const payment = await Payment.create({
    ...body,
    user: _id,
    expiryDate,
  })

  const updatedUser = await User.findOneAndUpdate({ _id }, { currentPlan: payment._id }, { new: true })
    .select("_id role isBlocked isDeleted currentPlan")
    .populate("currentPlan", "_id subscribedTo expiryDate noOfProfilesCanView")
    .lean()

  const redisKey = `${role}:${_id}`
  await redisClient.set(redisKey, JSON.stringify(updatedUser), {
    expiration: {
      type: "EX",
      value: 60 * 60 * 24, // 1 day
    }
  })

  return c.json({
    subscribedTo: payment.subscribedTo,
    expiryDate: payment.expiryDate
  })
}
