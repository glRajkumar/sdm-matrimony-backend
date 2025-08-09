import type { Context } from "hono";

import { hashPassword, getFilterObj } from "../utils/index.js";
import { redisClient } from "../services/connect-redis.js";
import { User } from "../models/index.js";

export async function getUsers(c: Context) {
  const { limit, skip, ...rest } = c.req.query()
  const filters = getFilterObj(rest)

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const fullList = await User.find(filters)
    .select("_id fullName email contactDetails.mobile profileImg gender dob maritalStatus proffessionalDetails.salary approvalStatus")
    .limit(numLimit)
    .skip(numSkip)
    .sort({ createdAt: -1 })
    .lean()

  return c.json(fullList)
}

export async function getMarriedUsers(c: Context) {
  const { limit, skip } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const select = "_id fullName email profileImg dob proffessionalDetails.salary marriedTo marriedOn"
  const marriedUsers = await User.find({
    marriedTo: { $exists: true },
    isMarried: true,
    gender: "Male"
  })
    .select(select)
    .populate("marriedTo", select.replace(" marriedTo marriedOn", ""))
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(marriedUsers)
}

export async function findUser(c: Context) {
  const query = c.req.query()
  const filters = Object.keys(query).reduce((acc: any, key) => {
    if (key === "fullName") {
      acc[key] = { $regex: query[key], $options: "i" }
    }
    else {
      acc[key] = query[key]
    }
    return acc
  }, {})

  const user = await User.find(filters)
    .select("_id fullName email profileImg dob gender maritalStatus proffessionalDetails.salary")
    .lean()

  return c.json(user)
}

export async function createUsers(c: Context) {
  const { _id } = c.get("user")

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
        email: user.email || undefined,
        contactDetails: {
          ...user?.contactDetails,
          mobile: user?.contactDetails?.mobile || undefined,
        },
        createdBy: _id,
      })

      const savedUser = await newUser.save()

      results.push({
        _id: savedUser._id,
        email: savedUser.email || undefined,
        mobile: savedUser.contactDetails?.mobile || undefined,
        error: null
      })

    } catch (error: any) {
      results.push({
        _id: null,
        email: user.email || undefined,
        mobile: user?.contactDetails?.mobile || undefined,
        error: error.message
      })
    }
  }

  return c.json({ results })
}

export async function userMarriedTo(c: Context) {
  const { _id, marriedTo, marriedOn } = await c.req.json()

  await User.bulkWrite([
    {
      updateOne: {
        filter: { _id },
        update: { $set: { marriedTo, isMarried: true, marriedOn } }
      }
    },
    {
      updateOne: {
        filter: { _id: marriedTo },
        update: { $set: { marriedTo: _id, isMarried: true, marriedOn } }
      }
    }
  ])

  return c.json({ message: "User married to updated successfully" })
}

export async function updateUser(c: Context) {
  const { _id, ...rest } = await c.req.json()

  const user = await User.findOneAndUpdate({ _id }, rest, { new: true })
    .select("role")
    .lean()

  if (user) await redisClient.del(`${user.role}:${_id}`)

  return c.json({ message: "User details updated successfully" })
}
