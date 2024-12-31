import type { Context } from 'hono';

import { generateOtp, getCloudinary, getToken } from '../utils/index.js';
import { comparePasswords, hashPassword } from "../utils/password.js";
// import transporter from '../utils/transporter.js';
import User from '../models/user.js';

export const register = async (c: Context) => {
  const { fullName, email, password, ...rest } = await c.req.json()

  const userExist = await User.findOne({ email }).select('_id')
  if (userExist) return c.json({ message: 'Email already exists' }, 400)
  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  const hashedPass = await hashPassword(password)

  const user = new User({ fullName, email, password: hashedPass, ...rest })
  await user.save()

  return c.json({ message: 'User saved successfully' })
}

export const login = async (c: Context) => {
  const { email, password } = await c.req.json()

  const user = await User.findOne({ email })
  if (!user) return c.json('Cannot find user in db', 401)

  const result = await comparePasswords(password, user.password)
  if (!result) return c.json({ message: 'Password not matched' }, 400)

  const payload: any = { _id: user._id.toString(), role: user.role }
  if (payload.role === "user") {
    payload.approvalStatus = user.approvalStatus
  }
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

export async function forgetPass(c: Context) {
  const { email } = await c.req.json()

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  const verifiyOtp = generateOtp()

  user.verifiyOtp = verifiyOtp

  // await transporter.sendMail({
  //   to: email,
  //   from: process.env.GMAIL_ID,
  //   subject: "Reset password key",
  //   html: `${verifiyOtp}`
  // })

  await user.save()

  return c.json({ message: "Passkey sent to email successfully" })
}

export async function resetPass(c: Context) {
  const { email, password, otp } = await c.req.json()

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  if (Number(otp) !== user.verifiyOtp) return c.json({ message: 'OTP not matched' }, 400)

  const hashedPass = await hashPassword(password)

  user.password = hashedPass
  user.verifiyOtp = undefined

  await user.save()

  return c.json({ message: "Password reseted successfully" })
}

// authendicated
export const me = async (c: Context) => {
  const user = c.get('user')
  const { token, ...rest } = user
  return c.json(rest)
}

export const logout = async (c: Context) => {
  const user = c.get('user')
  const token = c.get('token')

  await User.updateOne({ _id: user._id }, { $pull: { token } })
  return c.json({ message: 'User logged out successfully' })
}

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