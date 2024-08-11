import { FastifyReply, FastifyRequest } from "fastify";

import type { updateApprovalReq } from "../fastify-types/admin.js";

import User from "../models/User.js";

export async function getPendingList(req: FastifyRequest, res: FastifyReply) {
  try {
    const fullList = await User.find({ approvalStatus: "pending" })
      .select("_id fullName")
      .lean()

    res.send(fullList)

  } catch (error) {
    return res.code(400).send({ error, msg: "getPendingList error" })
  }
}

export async function updateApproval(req: updateApprovalReq, res: FastifyReply) {
  try {
    const { approvalStatus } = req.query
    const { _id } = req.params

    await User.updateOne(
      { _id },
      { $set: { approvalStatus } }
    )

    return res.send({ success: "Updated Successfully" })

  } catch (error) {
    return res.code(400).send({ error, msg: "Users fetch error" })
  }
}
