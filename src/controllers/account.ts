import type { Context } from 'hono';

import { generateOtp, getToken } from '../utils/index.js';
import { comparePasswords, hashPassword } from "../utils/password.js";
// import transporter from '../utils/transporter.js';

import Admin from '../models/admin.js';
import User from '../models/user.js';

export const register = async (c: Context) => {
  const { fullName, email, password, role = "user", ...rest } = await c.req.json()

  const Model = role === "user" ? User : Admin
  const userExist = await (Model as any).findOne({ email }).select('_id')
  if (userExist) return c.json({ message: 'Email already exists' }, 400)
  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  const hashedPass = await hashPassword(password)

  const user = new Model({ fullName, email, password: hashedPass, role, ...rest })
  await user.save()

  return c.json({ message: 'User saved successfully' })
}

export const login = async (c: Context) => {
  const { email, password, role = "user" } = await c.req.json()

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findOne({ email })
  if (!user) return c.json({ message: 'Cannot find user in db' }, 401)

  const result = await comparePasswords(password, user.password)
  if (!result) return c.json({ message: 'Password not matched' }, 400)

  const payload: any = { _id: user._id.toString(), role: user.role }
  if (payload.role === "user") {
    payload.approvalStatus = user.approvalStatus
  }
  const newToken = await getToken(payload)
  user.token = user.token.concat(newToken)
  await user.save()

  const output: any = {
    token: newToken,
    _id: user?._id,
    email: user?.email,
    fullName: user?.fullName,
    role: user?.role,
    approvalStatus: user?.approvalStatus,
  }

  if (role === "user") {
    output.gender = user?.gender
  }

  return c.json(output)
}

export async function forgetPass(c: Context) {
  const { email, role = "user" } = await c.req.json()

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findOne({ email })
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
  const { email, password, otp, role = "user" } = await c.req.json()

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  if (Number(otp) !== user.verifiyOtp) return c.json({ message: 'OTP not matched' }, 400)

  const hashedPass = await hashPassword(password)

  user.password = hashedPass
  user.verifiyOtp = undefined

  await user.save()

  return c.json({ message: "Password reseted successfully" })
}

export const me = async (c: Context) => {
  const user = c.get('user')
  const Model = user?.role === "user" ? User : Admin
  const userDetail = await (Model as any).findById(user._id).select("-password -token -__v").lean()
  return c.json(userDetail)
}

export const logout = async (c: Context) => {
  const user = c.get('user')
  const token = c.get('token')

  const Model = user?.role === "user" ? User : Admin
  await Model.updateOne({ _id: user._id }, { $pull: { token } })
  return c.json({ message: 'User logged out successfully' })
}
