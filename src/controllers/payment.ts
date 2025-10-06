import axios from 'axios';

import type { createOrderSchema, verifyPaymentSchema } from '../validations/payment.js';
import type { zContext } from '../types/index.js';

import { env, phonepayEndpoints, planPrices, planValidityMonths, profilesCount, type plansT } from '../utils/enums.js';
import { Payment, User } from '../models/index.js';
import { redisClient } from '../services/connect-redis.js';

async function getToken() {
  const requestBodyJson: any = {
    client_id: env.PHONE_PAY_CLIENT_ID,
    client_secret: env.PHONE_PAY_SECRET,
    client_version: 1,
    grant_type: "client_credentials"
  }

  const requestBody = new URLSearchParams(requestBodyJson).toString()

  const res = await fetch(phonepayEndpoints.getAccessToke, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: requestBody
  })

  if (!res.ok) {
    throw new Error("Error on creating order", {
      cause: { status: res.status, statusText: res.statusText }
    })
  }

  return await res.json()
}

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

  const authJson = await getToken()
  const merchantOrderId = `Tx-${Date.now()}`
  const orderBody = {
    "merchantOrderId": merchantOrderId,
    "amount": 1 * 100,
    "expireAfter": 3600,
    "metaInfo": {
      "udf1": JSON.stringify(notes),
    },
    "paymentFlow": {
      "type": "PG_CHECKOUT",
      "message": "Payment message used for collect requests"
    }
  }

  const { data } = await axios.post(phonepayEndpoints.createOrder, orderBody, {
    headers: {
      "Authorization": `${authJson.token_type} ${authJson.access_token}`
    }
  })

  return c.json({ ...data, amount, merchantOrderId })
}

export const verifyPayment = async (c: zContext<{ json: typeof verifyPaymentSchema }>) => {
  const { _id, role } = c.get("user")
  const { merchantOrderId, ...body } = c.req.valid("json")

  if (!body.isAssisted) {
    body.assistedMonths = 0
  }

  const expiryDate = new Date(Date.now() + planValidityMonths[body.subscribedTo as plansT] * 24 * 60 * 60 * 1000)

  const authJson = await getToken()

  const url = phonepayEndpoints.orderStatus(merchantOrderId)
  const { data } = await axios.get(url, {
    headers: {
      "Authorization": `${authJson.token_type} ${authJson.access_token}`
    }
  })
  console.log("data", data)
  if (data.state !== "COMPLETED") {
    return c.json({ message: data?.errorContext?.description || data?.message }, 400)
  }

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
