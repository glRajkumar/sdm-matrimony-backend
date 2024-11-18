import type { Context } from 'hono';

import { comparePasswords, hashPassword } from "../utils/password.js";
import { getCloudinary, getToken } from '../utils/index.js';
import User from '../models/user.js';

export const register = async (c: Context) => {
  const { fullName, email, password, ...rest } = await c.req.json()

  const userExist = await User.findOne({ email }).select('_id')
  if (userExist) return c.json({ msg: 'Email already exists' }, 400)
  if (!password) return c.json({ msg: "Password shouldn't be empty" }, 400)

  const hashedPass = await hashPassword(password)

  const user = new User({ fullName, email, password: hashedPass, ...rest })
  await user.save()

  return c.json({ msg: 'User saved successfully' })
}

export const login = async (c: Context) => {
  const { email, password } = await c.req.json()

  const user = await User.findOne({ email })
  if (!user) return c.json('Cannot find user in db', 401)

  const result = await comparePasswords(password, user.password)
  if (!result) return c.json({ msg: 'Password not matched' }, 400)

  const payload = { _id: user._id.toString(), role: user.role }
  const newToken = await getToken(payload)
  user.token = user.token.concat(newToken)
  await user.save()

  const output = {
    token: newToken,
    id: user?._id,
    email: user?.email,
    fullName: user?.fullName,
    gender: user?.gender,
    role: user?.role,
    approvalStatus: user?.approvalStatus,
  }

  return c.json(output)
}

export const me = async (c: Context) => {
  const user = c.get('user')
  const { token, ...rest } = user
  return c.json(rest)
}

export const logout = async (c: Context) => {
  const user = c.get('user')
  const token = c.get('token')

  await User.updateOne({ _id: user._id }, { $pull: { token } })
  return c.json({ msg: 'User logged out successfully' })
}

export const imgUpload = async (c: Context) => {
  const user = c.get('user')
  const formData = await c.req.formData()
  const file = formData.get('file') as File

  if (!file) return c.json({ msg: 'No file uploaded' }, 400)

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const cloudinary = getCloudinary()
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'my_uploads' },
      (error: any, result: any) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(buffer)
  })

  await User.updateOne({ _id: user._id }, { $push: { images: result.url } })

  return c.json({ msg: 'User image uploaded successfully' })
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
  const { gender, marriedStatus, salaryRange, rasi, age } = c.req.query()

  const filter: any = {
    role: 'user',
    approvalStatus: 'approved',
  }

  if (gender) {
    filter.gender = gender === 'male' ? 'female' : 'male'
  }

  if (marriedStatus) {
    filter.isMarried = marriedStatus
  }

  if (salaryRange) {
    switch (salaryRange) {
      case 'below_20000':
        filter.salary = { $lt: 20000 }
        break
      case '20000_30000':
        filter.salary = { $gte: 20000, $lte: 30000 }
        break
      case '30000_40000':
        filter.salary = { $gte: 30000, $lte: 40000 }
        break
      case '40000_50000':
        filter.salary = { $gte: 40000, $lte: 50000 }
        break
      case 'above_50000':
        filter.salary = { $gt: 50000 }
        break
    }
  }

  if (age) {
    switch (age) {
      case 'below_25':
        filter.age = { $lt: 25 }
        break
      case '25_30':
        filter.age = { $gte: 25, $lte: 30 }
        break
      case '30_40':
        filter.age = { $gte: 30, $lte: 40 }
        break
      case 'above_40':
        filter.age = { $gt: 40 }
        break
    }
  }

  if (rasi) {
    filter.rasi = { $in: rasi }
  }

  const getMatches = await User.find(filter)
    .select('-token -password')
    .lean()

  return c.json(getMatches)
}