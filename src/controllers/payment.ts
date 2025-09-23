import Razorpay from 'razorpay';

import type { createOrderSchema, verifyPaymentSchema } from '../validations/payment.js';
import type { zContext } from '../types/index.js';

import { env, planPrices, planValidityMonths, profilesCount, type plansT } from '../utils/enums.js';
import { Payment, User } from '../models/index.js';
import { redisClient } from '../services/connect-redis.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_SECRET,
})

export const createOrder = async (c: zContext<{ json: typeof createOrderSchema }>) => {
  const { _id } = c.get("user")
  const {
    subscribedTo = "basic",
    noOfProfilesCanView = 30,
    isAssisted = false,
    assistedMonths = 0
  } = c.req.valid("json")

  let amount = planPrices[subscribedTo]

  const notes: any = {
    user_id: _id,
    subscribedTo,
    noOfProfilesCanView,
    isAssisted,
    assistedMonths,
  }

  if (noOfProfilesCanView === 999) {
    // Unlimited
    amount += 20_000
  } else {
    const added = noOfProfilesCanView - profilesCount[subscribedTo]
    if (added >= 50) {
      amount += (added / 50) * 1_000
    }
  }

  if (isAssisted) {
    amount += assistedMonths * 10_000
  }

  const options = {
    amount: 10000,
    currency: "INR",
    notes,
  }

  const order = await razorpay.orders.create(options)
  return c.json(order)
}

export const verifyPayment = async (c: zContext<{ json: typeof verifyPaymentSchema }>) => {
  const { _id, role } = c.get("user")
  const body = c.req.valid("json")

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
