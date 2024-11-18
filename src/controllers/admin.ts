import type { Context } from "hono";

import User from "../models/user.js";

export async function getPendingList(c: Context) {
  const fullList = await User.find({ approvalStatus: "pending" })
    .select("_id fullName")
    .lean()

  c.json(fullList)
}

export async function updateApproval(c: Context) {
  const { approvalStatus } = c.req.query()
  const { _id } = c.req.param()

  await User.updateOne(
    { _id },
    { $set: { approvalStatus } }
  )

  return c.json({ success: "Updated Successfully" })
}
