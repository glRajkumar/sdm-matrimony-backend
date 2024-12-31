import type { Context } from "hono";

import User from "../models/user.js";

export async function getPendingList(c: Context) {
  const fullList = await User.find({ approvalStatus: "pending" })
    .select("_id fullName email images gender dob salary")
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
