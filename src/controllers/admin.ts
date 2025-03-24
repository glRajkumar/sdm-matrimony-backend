import type { Context } from "hono";

import { hashPassword, getFilterObj } from "../utils/index.js";
import User from "../models/user.js";

export async function getUsers(c: Context) {
  const { limit, skip, ...rest } = c.req.query()
  const filters = getFilterObj(rest)

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const fullList = await User.find(filters)
    .select("_id fullName email profileImg gender dob maritalStatus proffessionalDetails.salary approvalStatus")
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(fullList)
}

export async function getMarriedUsers(c: Context) {
  const select = "_id fullName email profileImg dob proffessionalDetails.salary marriedTo"
  const marriedUsers = await User.find({
    marriedTo: { $exists: true },
    isMarried: true,
    gender: "Male"
  })
    .select(select)
    .populate("marriedTo", select.replace(" marriedTo", ""))
    .lean()

  return c.json(marriedUsers)
}

export async function createUsers(c: Context) {
  // const users = await c.req.json()

  // const payload = await Promise.all(users.map(async (user: any) => {
  //   const hashedPass = await hashPassword(user.password)
  //   return {
  //     ...user,
  //     password: hashedPass,
  //     approvalStatus: "approved",
  //   }
  // }))

  // await User.insertMany(payload)

  // return c.json({ message: "Status updated successfully" })

  const users = await c.req.json()
  const results = []

  for (const user of users) {
    try {
      const hashedPass = await hashPassword(user.password)
      const newUser = new User({
        ...user,
        password: hashedPass,
        approvalStatus: "approved",
      })

      const savedUser = await newUser.save()

      results.push({ _id: savedUser._id, email: savedUser.email, error: null })

    } catch (error: any) {
      results.push({ _id: null, email: user.email, error: error.message })
    }
  }

  return c.json({ results })
}

export async function userMarriedTo(c: Context) {
  const { _id, marriedTo } = await c.req.json()

  await User.bulkWrite([
    {
      updateOne: {
        filter: { _id },
        update: { $set: { marriedTo, isMarried: true } }
      }
    },
    {
      updateOne: {
        filter: { _id: marriedTo },
        update: { $set: { marriedTo: _id, isMarried: true } }
      }
    }
  ])

  return c.json({ message: "User married to updated successfully" })
}

export async function updateUser(c: Context) {
  const { _id, ...rest } = await c.req.json()

  await User.updateOne({ _id }, rest)

  return c.json({ message: "User details updated successfully" })
}
