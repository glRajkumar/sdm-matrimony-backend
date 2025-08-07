import type { Context } from "hono";

import { Payment, User } from "../models/index.js";

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

export async function getUsersByCreatedBy(c: Context) {
  const { _id } = c.get("user")
  const { limit, skip, createdAtToday } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const select = "_id fullName email profileImg dob proffessionalDetails.salary"

  const payload: any = {
    createdBy: _id
  }

  if (createdAtToday) {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    payload.createdAt = {
      $gte: startOfToday,
      $lte: endOfToday,
    }
  }

  const unmarriedUsers = await User.find(payload)
    .select(select)
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(unmarriedUsers)
}

export async function getUserCreationStatsPerAdmin(c: Context) {
  const result = await User.aggregate([
    {
      $match: {
        createdBy: { $ne: null }
      }
    },
    {
      $group: {
        _id: {
          createdBy: "$createdBy",
          date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } }
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.createdBy",
        dailyCounts: {
          $push: {
            k: "$_id.date",
            v: "$count"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        result: {
          k: { $toString: "$_id" },
          v: { $arrayToObject: "$dailyCounts" }
        }
      }
    },
    {
      $replaceRoot: { newRoot: "$result" }
    }
  ])

  return c.json(result)
}

export async function getUserCreationStatsToday(c: Context) {
  const result = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        createdBy: { $ne: null }
      }
    },
    {
      $group: {
        _id: {
          createdBy: "$createdBy",
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: "$_id.createdBy",
        created: "$count"
      }
    }
  ])

  return c.json(result)
}
