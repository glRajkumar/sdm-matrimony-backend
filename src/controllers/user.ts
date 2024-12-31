import type { Context } from 'hono';

import { getCloudinary } from '../utils/index.js';
import { getFilterObj } from '../utils/user-filter-obj.js';
import User from '../models/user.js';

export const imgUpload = async (c: Context) => {
  const user = c.get('user')
  const formData = await c.req.formData()
  const file = formData.get("file")

  if (!file) return c.json({ message: 'No file uploaded' }, 400)

  const buffer = await (file as Blob).arrayBuffer()
  const nodeBuffer = Buffer.from(buffer)

  const cloudinary = getCloudinary()
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'my_uploads' },
      (error: any, result: any) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(nodeBuffer)
  })

  await User.updateOne({ _id: user._id }, { $push: { images: result.url } })

  return c.json({ message: 'User image uploaded successfully' })
}

export const getUsers = async (c: Context) => {
  const users = await User.find()
  return c.json(users)
}

export const getUserDetails = async (c: Context) => {
  const { _id } = c.req.param()
  const userDetails = await User.findOne({ _id }).select('-token -password')
  return c.json(userDetails)
}

export const getMatches = async (c: Context) => {
  const { limit, skip, ...rest } = c.req.query()
  const filters = getFilterObj(rest)

  const numLimit = Number(limit || 10)
  const numSkip = Number(skip || 0)

  const getMatches = await User.find(filters)
    .select('-token -password -role -brokerAppointed -approvalStatus -verifiyOtp')
    .limit(numLimit)
    .skip(numSkip)
    .lean()

  return c.json(getMatches)
}