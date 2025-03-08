import type { Context } from "hono";

import { getFilterObj } from "../utils/user-filter-obj.js";
import User from "../models/user.js";

export async function getUsers(c: Context) {
  const { limit, skip, ...rest } = c.req.query()
  const filters = getFilterObj(rest)

  console.log(filters)
  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const fullList = await User.find(filters)
    .select("_id fullName email images gender dob salary")
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(fullList)
}

export async function updateApproval(c: Context) {
  const { _id, approvalStatus } = await c.req.json()

  await User.updateOne(
    { _id },
    { $set: { approvalStatus } }
  )

  return c.json({ message: "Status updated successfully" })
}
