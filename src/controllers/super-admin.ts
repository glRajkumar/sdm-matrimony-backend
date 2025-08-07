import type { Context } from "hono";

import { Payment, User, Admin } from "../models/index.js";
import { hashPassword } from "../utils/password.js";

export async function getPaidUsers(c: Context) {
  const { limit, skip } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const paidUsers = await Payment.find({
    expiryDate: { $gte: new Date() },
  })
    .select("_id amount subscribedTo expiryDate noOfProfilesCanView isAssisted assistedMonths")
    .populate("user", "_id fullName email profileImg dob proffessionalDetails.salary")
    .limit(numLimit)
    .skip(numSkip)
    .sort({ createdAt: -1 })
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
    .select("_id amount subscribedTo expiryDate noOfProfilesCanView isAssisted assistedMonths")
    .populate("user", "_id fullName email profileImg dob proffessionalDetails.salary")
    .limit(numLimit)
    .skip(numSkip)
    .sort({ createdAt: -1 })
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
    { $sort: { createdAt: -1 } },
  ])

  return c.json(paidUsers)
}

export async function getUsersByCreatedBy(c: Context) {
  const { _id } = c.get("user")
  const { limit, skip, createdAtToday, createdBy } = c.req.query()

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const select = "_id fullName email profileImg dob proffessionalDetails.salary"

  const payload: any = {
    createdBy: createdBy || _id
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

  const users = await User.find(payload)
    .select(select)
    .limit(numLimit)
    .skip(numSkip)
    .sort({ createdAt: -1 })
    .lean()

  return c.json(users)
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
      $lookup: {
        from: "admins",
        localField: "_id",
        foreignField: "_id",
        as: "adminDetails"
      }
    },
    {
      $unwind: "$adminDetails"
    },
    {
      $project: {
        _id: "$_id",
        fullName: "$adminDetails.fullName",
        email: "$adminDetails.email",
        dates: { $arrayToObject: "$dailyCounts" }
      }
    }
  ]);

  return c.json(result);
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
      $lookup: {
        from: "admins",
        localField: "_id.createdBy",
        foreignField: "_id",
        as: "adminDetails"
      }
    },
    {
      $unwind: "$adminDetails"
    },
    {
      $project: {
        _id: "$_id.createdBy",
        fullName: "$adminDetails.fullName",
        email: "$adminDetails.email",
        created: "$count"
      }
    }
  ])

  return c.json(result)
}

export async function getAdmins(c: Context) {
  const admins = await Admin.find()
    .select("_id fullName email isDeleted")
    .lean()

  return c.json(admins)
}

export async function createAdmin(c: Context) {
  const { email, password, ...rest } = await c.req.json()

  if (!email && !rest?.contactDetails?.mobile) return c.json({ message: "Email or Mobile is required" }, 400)
  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  const findBy: Record<string, any> = {}
  if (email && rest?.contactDetails?.mobile) {
    findBy.$or = [{ email }, { "contactDetails.mobile": rest.contactDetails.mobile }]
  }
  else if (email) {
    findBy.email = email
  }
  else {
    findBy["contactDetails.mobile"] = rest?.contactDetails?.mobile
  }

  const adminExist = await Admin.findOne(findBy)
    .select("_id")
    .lean()

  if (adminExist) return c.json({ message: "Admin already exists" }, 400)

  const hashedPass = await hashPassword(password)

  const admin = new Admin({
    ...rest,
    email: email || undefined,
    password: hashedPass,
    approvalStatus: "approved",
    isVerified: true,
    contactDetails: {
      ...rest?.contactDetails,
      mobile: rest?.contactDetails?.mobile || undefined,
    },
  })

  await admin.save()

  return c.json({ message: "Admin created successfully" })
}

export async function updateAdmin(c: Context) {
  const { _id } = c.req.param()
  const rest = await c.req.json()

  await Admin.updateOne({ _id }, rest)

  return c.json({ message: "Admin details updated successfully" })
}
