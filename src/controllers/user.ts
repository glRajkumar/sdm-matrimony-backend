import type { Context } from 'hono';

import { getImgUrl, getFilterObj, deleteImg } from '../utils/index.js';
import User from '../models/user.js';

const userSelectFields = "_id fullName profileImg maritalStatus gender dob proffessionalDetails otherDetails"

export const getUserDetails = async (c: Context) => {
  const { _id } = c.req.param()
  const user = c.get("user")

  const isAuthorised = user._id.toString() === _id
  const select = `-refreshTokens -password -liked -disliked -verifiyOtp -role -brokerAppointed -approvalStatus ${isAuthorised ? "" : "-contactDetails -email -payment"}`.trim()
  const userDetails = await User.findOne({ _id })
    .select(select)
    .lean()

  return c.json(userDetails)
}

export const getMatches = async (c: Context) => {
  const { limit, skip, ...rest } = c.req.query()
  const { _id } = c.get("user")
  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const user = await User.findById(_id).select("-refreshTokens -images -verifiyOtp -role -brokerAppointed").lean()
  const payload: any = {}

  if (user?.gender === "Male") {
    payload.gender = "Female" // ["Female", "Other"]
  }
  else if (user?.gender === "Female") {
    payload.gender = "Male" // ["Female", "Other"]
  }

  const filters = getFilterObj({ ...rest, ...payload, })

  const liked = user?.liked || []
  // const disliked = user?.disliked || []

  // const getMatches = await User.find({ ...filters, _id: { $ne: _id } })
  //   .select(userSelectFields)
  //   .limit(numLimit)
  //   .skip(numSkip)
  //   .lean()

  // const final = getMatches.map(us => ({
  //   ...us,
  //   isLiked: liked.includes(us._id),
  //   isDisliked: disliked.includes(us._id)
  // }))


  const baseFilters = { ...filters, _id: { $ne: _id } }
  const select = userSelectFields.split(" ").reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
  const final = await User.aggregate([
    { $match: baseFilters },
    { $skip: numSkip },
    { $limit: numLimit },
    { $project: select },
    {
      $addFields: {
        isLiked: {
          $in: ["$_id", liked]
        },
        // isDisliked: {
        //   $in: ["$_id", disliked]
        // }
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
    })
    .lean()

  // @ts-ignore
  return c.json(list?.[type] || [])
}

export const addLiked = async (c: Context) => {
  const { _id } = c.get("user")
  const { userId, type = "liked" } = await c.req.json()
  const updateObj: any = { $push: { [type]: userId } }
  const otherType = type === "liked" ? "disliked" : "liked"
  updateObj.$pull = { [otherType]: userId }
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

  const _id = user.role === "admin" ? payload._id : user._id
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

  const _id = user.role === "admin" ? formData.get("_id") : user._id
  await User.updateOne({ _id }, updateQuery)

  return c.json({ message: 'User image uploaded successfully' })
}

export const imgDelete = async (c: Context) => {
  const { _id } = c.req.param()
  await deleteImg(_id)
  return c.json({ message: 'Image deleted successfully' })
}
