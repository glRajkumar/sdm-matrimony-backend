import type { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

import {
  env, generateOtp, getImgUrl, getToken, verifyToken,
  comparePasswords, hashPassword, tokenEnums, tokenValidity,
  isEmail,
} from '../utils/index.js';

import Admin from '../models/admin.js';
import User from '../models/user.js';

function setRefreshTokenCookie(c: Context, refresh_token: string) {
  const host = c.req.header("host") || ""
  const baseDomain = host.split('.').slice(-2).join('.')

  const isProduction = env.NODE_ENV === 'production'

  setCookie(c, tokenEnums.refreshToken, refresh_token, {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    domain: isProduction ? baseDomain : undefined,
    secure: isProduction,
    maxAge: tokenValidity.refreshToken,
  })
}

export const register = async (c: Context) => {
  const { email, password, role = "user", ...rest } = await c.req.json()

  if (!email && !rest?.contactDetails?.mobile) return c.json({ message: "Email or Mobile is required" }, 400)
  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  const Model = role === "user" ? User : Admin

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

  const userExist = await (Model as any).findOne(findBy).select('_id email contactDetails').lean()

  if (userExist) return c.json({ message: 'Email or Moboile number already exists' }, 400)

  const hashedPass = await hashPassword(password)

  const user = new Model({
    ...rest,
    role,
    email: email || undefined,
    password: hashedPass,
    contactDetails: {
      ...rest?.contactDetails,
      mobile: rest?.contactDetails?.mobile || undefined,
    },
  })

  await user.save()

  return c.json({ message: 'User saved successfully' })
}

export const login = async (c: Context) => {
  const { email, password, role = "user" } = await c.req.json()

  if (!email || !password) return c.json({ message: "Email or password is missing" }, 400)

  const Model = role === "user" ? User : Admin
  const findBy = isEmail(email) ? { email } : { "contactDetails.mobile": email }

  const user = await (Model as any).findOne(findBy)
  if (!user) return c.json({ message: 'Cannot find user in db' }, 401)

  const result = await comparePasswords(password, user.password)
  if (!result) return c.json({ message: 'Password not matched' }, 400)

  const payload: any = { _id: user._id.toString(), role: user.role }
  if (payload.role === "user") {
    payload.approvalStatus = user.approvalStatus
  }

  const refresh_token = await getToken(payload, tokenEnums.refreshToken)
  const access_token = await getToken(payload, tokenEnums.accessToken)

  user.refreshTokens = user.refreshTokens.concat(refresh_token)
  await user.save()

  const output: any = {
    access_token,
    _id: user?._id,
    role: user?.role,
    email: user?.email,
    fullName: user?.fullName,
    approvalStatus: user?.approvalStatus,
  }

  if (role === "user") {
    output.gender = user?.gender
  }

  setRefreshTokenCookie(c, refresh_token)

  return c.json(output)
}

export async function accessToken(c: Context) {
  const refresh_token = getCookie(c, tokenEnums.refreshToken)

  if (!refresh_token) return c.json({ message: 'Refresh token is required' }, 400)

  const { _id, role, type } = await verifyToken(refresh_token, tokenEnums.refreshToken)

  if (type !== "refresh") return c.json({ message: 'Invalid token' }, 400)

  const Model = role === "user" ? User : Admin

  const user = await (Model as any).findOne({ _id, refreshTokens: refresh_token })
    .select("_id role approvalStatus")
    .lean()

  if (!user) return c.json({ message: 'Invalid refresh token or User not found' }, 400)

  const payload: any = { _id: user._id.toString(), role: user.role }
  if (payload.role === "user") {
    payload.approvalStatus = user.approvalStatus
  }

  const access_token = await getToken(payload, tokenEnums.accessToken)

  return c.json({ access_token })
}

export async function forgetPass(c: Context) {
  const { email, role = "user" } = await c.req.json()

  const Model = role === "user" ? User : Admin
  const findBy = isEmail(email) ? { email } : { "contactDetails.mobile": email }
  const user = await (Model as any).findOne(findBy)

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
  const findBy = isEmail(email) ? { email } : { "contactDetails.mobile": email }
  const user = await (Model as any).findOne(findBy)
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  if (Number(otp) !== user.verifiyOtp) return c.json({ message: 'OTP not matched' }, 400)

  const hashedPass = await hashPassword(password)

  user.password = hashedPass
  user.verifiyOtp = undefined

  await user.save()

  return c.json({ message: "Password reseted successfully" })
}

export const imgUpload = async (c: Context) => {
  const formData = await c.req.formData()

  const image = formData.get("image")

  if (!image) return c.json({ message: 'No images found' }, 400)

  const url = await getImgUrl(image)

  return c.json({ url })
}

export const approvalStatusRefresh = async (c: Context) => {
  const { role, _id } = c.get('user')

  const Model = role === "user" ? User : Admin
  const user = await (Model as any).findOne({ _id })
  if (!user) return c.json({ message: 'Cannot find user in db' }, 401)

  if (user.approvalStatus === "pending") {
    return c.json({ message: "Account not approved yet" }, 400)
  }

  if (user.approvalStatus === "rejected") {
    return c.json({ message: "Account rejected" }, 400)
  }

  const payload: any = { _id: user._id.toString(), role: user.role }
  if (payload.role === "user") {
    payload.approvalStatus = user.approvalStatus
  }

  const refresh_token = await getToken(payload, tokenEnums.refreshToken)
  const access_token = await getToken(payload, tokenEnums.accessToken)

  user.refreshTokens = [refresh_token]
  await user.save()

  const output: any = {
    access_token,
    _id: user?._id,
    role: user?.role,
    email: user?.email,
    fullName: user?.fullName,
    approvalStatus: user?.approvalStatus,
  }

  if (role === "user") {
    output.gender = user?.gender
  }

  setRefreshTokenCookie(c, refresh_token)

  return c.json(output)
}

export const me = async (c: Context) => {
  const user = c.get('user')
  const Model = user?.role === "user" ? User : Admin
  const userDetail = await (Model as any).findById(user._id).select("-password -refreshTokens -__v").lean()
  return c.json(userDetail)
}

export const logout = async (c: Context) => {
  const user = c.get('user')
  const refresh_token = getCookie(c, tokenEnums.refreshToken)

  const Model = user?.role === "user" ? User : Admin
  await (Model as any).updateOne({ _id: user._id }, {
    $pull: { refreshTokens: refresh_token }
  })

  deleteCookie(c, tokenEnums.refreshToken)
  return c.json({ message: 'User logged out successfully' })
}
