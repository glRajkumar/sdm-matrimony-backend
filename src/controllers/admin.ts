import type { Context } from "hono";

import { hashPassword, getFilterObj } from "../utils/index.js";
import { Payment, User } from "../models/index.js";

export async function getUsers(c: Context) {
  const { limit, skip, ...rest } = c.req.query()
  const filters = getFilterObj(rest)

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const fullList = await User.find(filters)
    .select("_id fullName email contactDetails.mobile profileImg gender dob maritalStatus proffessionalDetails.salary approvalStatus")
    .limit(numLimit)
    .skip(numSkip)
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

export async function getPaidUsers(c: Context) {
  const { limit, skip } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const paidUsers = await Payment.find({
    expiryDate: { $gte: new Date() },
  })
    .select("_id subscribedTo expiryDate noOfProfilesCanView isAssisted assistedMonths")
    .populate("user", "_id fullName email profileImg dob proffessionalDetails.salary")
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(paidUsers)
}

export async function getAssistedSubscribedUsers(c: Context) {
  const { limit, skip } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const paidUsers = await Payment.find({
    expiryDate: { $gte: new Date() },
    isAssisted: true,
  })
    .select("_id subscribedTo expiryDate noOfProfilesCanView isAssisted assistedMonths")
    .populate("user", "_id fullName email profileImg dob proffessionalDetails.salary")
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(paidUsers)
}

export async function getUsersAllPayments(c: Context) {
  const { limit, skip } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const paidUsers = await Payment.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $match: {
        'user.currentPlan': { $ne: null },
      },
    },
    {
      $group: {
        _id: '$user._id',
        user: {
          $first: {
            _id: '$user._id',
            dob: '$user.dob',
            email: '$user.email',
            gender: '$user.gender',
            fullName: '$user.fullName',
            profileImg: '$user.profileImg',
            currentPlan: '$user.currentPlan',
            maritalStatus: '$user.maritalStatus',
          },
        },
        payments: {
          $push: {
            _id: '$_id',
            amount: '$amount',
            expiryDate: '$expiryDate',
            isAssisted: '$isAssisted',
            subscribedTo: '$subscribedTo',
            assistedMonths: '$assistedMonths',
          },
        },
      },
    },
    { $skip: numSkip },
    { $limit: numLimit },
  ])

  return c.json(paidUsers)
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
        email: user.email || undefined,
        contactDetails: {
          ...user?.contactDetails,
          mobile: user?.contactDetails?.mobile || undefined,
        },
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

  await User.updateOne({ _id }, rest)

  return c.json({ message: "User details updated successfully" })
}
