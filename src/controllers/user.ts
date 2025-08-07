import type { Context } from 'hono';

import { getImgUrl, deleteImg } from '../services/index.js';
import { UserAccess, User } from '../models/index.js';

import { getFilterObj } from '../utils/index.js';

const userSelectFields = "_id fullName profileImg maritalStatus gender dob proffessionalDetails otherDetails currentPlan isVerified"
const currentPlanSelectFields = "-_id subscribedTo expiryDate"

async function checkUserAccess(user: any, _id: string) {
  const isOwner = user._id.toString() === _id
  if (isOwner || user.role.includes("admin")) return true

  const hasAccess = user.role === "user" && user.currentPlan &&
    new Date(user.currentPlan.expiryDate).getTime() > new Date().getTime()
  if (!hasAccess) return false

  const hasUnlockedAccess = await UserAccess.findOne({
    viewer: user._id,
    viewed: _id,
    payment: user.currentPlan._id,
  }).select("_id").lean()

  return !!hasUnlockedAccess
}

export const getUserDetails = async (c: Context) => {
  const { _id } = c.req.param()
  const user = c.get("user")

  const hasFullAccess = await checkUserAccess(user, _id)

  let select = "-refreshTokens -password -liked -verifiyOtp -role -brokerAppointed -approvalStatus -email"

  if (!hasFullAccess) {
    select += " -contactDetails -vedicHoroscope.vedicHoroscopePic"
  }

  const userDetails = await User.findOne({ _id })
    .select(select)
    .populate("currentPlan", currentPlanSelectFields)
    .lean()

  return c.json(userDetails)
}

export const getAccountInfo = async (c: Context) => {
  const { _id } = c.get("user")

  const user = await User.findById(_id)
    .select("email isVerified currentPlan")
    .populate("currentPlan", "amount subscribedTo expiryDate noOfProfilesCanView isAssisted assistedMonths")
    .lean()

  const unlockedCount = await UserAccess.countDocuments({
    viewer: user?._id,
    payment: user?.currentPlan?._id
  })

  const payload = {
    ...user,
    unlockedCount,
  }

  return c.json(payload)
}

export const getPartnerPreferences = async (c: Context) => {
  const { _id } = c.get("user")

  const user = await User.findById(_id)
    .select("partnerPreferences otherDetails.caste")
    .lean()

  const payload = {
    ...user?.partnerPreferences,
    caste: user?.partnerPreferences?.caste || (user?.otherDetails?.caste === "Don't wish to specify" ? "Any" : user?.otherDetails?.caste)
  }

  return c.json(payload)
}

export const getMatches = async (c: Context) => {
  const { limit, skip, ...rest } = c.req.query()
  const { _id } = c.get("user")
  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const user = await User.findById(_id)
    .select("-refreshTokens -images -verifiyOtp -role -brokerAppointed")
    .lean()
  const payload: any = {}

  if (user?.gender === "Male") {
    payload.gender = "Female" // ["Female", "Other"]
  }
  else if (user?.gender === "Female") {
    payload.gender = "Male" // ["Female", "Other"]
  }

  const filters = getFilterObj({ ...rest, ...payload, })

  const liked = user?.liked || []

  const baseFilters = { ...filters, _id: { $ne: _id } }
  const select = userSelectFields.split(" ").reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
  const final = await User.aggregate([
    { $match: baseFilters },
    { $skip: numSkip },
    { $limit: numLimit },
    { $project: select },
    {
      $lookup: {
        from: "payments",
        localField: "currentPlan",
        foreignField: "_id",
        as: "currentPlan",
        pipeline: [{
          $project: {
            _id: 0,
            subscribedTo: 1,
            expiryDate: 1,
          }
        }],
      }
    },
    {
      $unwind: {
        path: "$currentPlan",
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $addFields: {
        isLiked: {
          $in: ["$_id", liked]
        },
      }
    }
  ])

  return c.json(final)
}

export const getLikesList = async (c: Context) => {
  const { limit, skip, type = 'liked' } = c.req.query()
  const { _id } = c.get("user")

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const list = await User.findOne({ _id })
    .select(type)
    .populate({
      path: type,
      select: userSelectFields,
      options: {
        limit: numLimit,
        skip: numSkip,
      },
      populate: {
        path: "currentPlan",
        select: currentPlanSelectFields,
      },
    })
    .lean()

  // @ts-ignore
  return c.json(list?.[type] || [])
}

export const getUnlockedProfiles = async (c: Context) => {
  const { _id, currentPlan } = c.get("user")

  const list = await UserAccess.find({ viewer: _id, payment: currentPlan._id })
    .select("viewed")
    .populate({
      path: "viewed",
      select: userSelectFields,
      populate: {
        path: "currentPlan",
        select: currentPlanSelectFields,
      },
    })
    .lean()

  const payload = list.map((item) => item.viewed)

  return c.json(payload)
}

export const addLiked = async (c: Context) => {
  const { _id } = c.get("user")
  const { userId, type = "liked" } = await c.req.json()
  const updateObj: any = { $push: { [type]: userId } }
  // const otherType = type === "liked" ? "disliked" : "liked"
  // updateObj.$pull = { [otherType]: userId }
  await User.updateOne({ _id }, updateObj)
  return c.json({ message: `User added to ${type} list successfully` })
}

export const removeLiked = async (c: Context) => {
  const { _id } = c.get("user")
  const { userId, type } = await c.req.json()
  await User.updateOne({ _id }, { $pull: { [type]: userId } })
  return c.json({ message: `User removed from ${type} list successfully` })
}

export const updateProfile = async (c: Context) => {
  const user = c.get("user")
  const payload = await c.req.json()

  const _id = user.role === "user" ? user._id : payload._id
  await User.updateOne({ _id }, payload)

  return c.json({ message: "User details updated successfully" })
}

export const imgUpload = async (c: Context) => {
  const user = c.get('user')
  const formData = await c.req.formData()

  const isProfilePic = formData.get("isProfilePic") === "true"
  const images = formData.getAll("images")

  if (!images || (Array.isArray(images) && images.length === 0)) return c.json({ message: 'No images found' }, 400)

  const uploadedImages = await Promise.all(images.map(async (image) => await getImgUrl(image)))

  const updateQuery: any = {
    $push: {
      images: { $each: uploadedImages }
    }
  }

  if (isProfilePic) {
    updateQuery.profileImg = uploadedImages[0]
  }

  const _id = user.role === "user" ? user._id : formData.get("_id")
  await User.updateOne({ _id }, updateQuery)

  return c.json({ message: 'User image uploaded successfully' })
}

export const imgDelete = async (c: Context) => {
  const { _id } = c.req.param()
  await deleteImg(_id)
  return c.json({ message: 'Image deleted successfully' })
}

export const unlockProfile = async (c: Context) => {
  const { _id } = await c.req.json()
  const user = c.get("user")

  const hasFullAccess = await checkUserAccess(user, _id)
  if (hasFullAccess) return c.json({ message: "You have full access to this profile already" })

  const unlockedCount = await UserAccess.countDocuments({
    viewer: user._id,
    payment: user.currentPlan._id
  })

  if (unlockedCount >= user.currentPlan.noOfProfilesCanView) return c.json({ message: "You have reached the limit of unlocked profiles" }, 400)

  await UserAccess.create({
    viewer: user._id,
    viewed: _id,
    payment: user.currentPlan._id,
    expiresAt: new Date(user.currentPlan.expiryDate),
  })

  return c.json({ message: "Profile unlocked successfully" })
}
