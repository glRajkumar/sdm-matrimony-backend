import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Readable } from 'stream';
import bcrypt from "bcryptjs";

import { loginReq, registerReq } from "../fastify-types/user.js";

import User from "../models/User.js";

export async function register(req: registerReq, res: FastifyReply) {
  const { fullName, email, password, ...rest } = req.body

  const userExist = await User.findOne({ email }).select("_id")
  if (userExist) return res.status(400).send({ msg: "Email is already exists" })
  if (!password) return res.status(400).send({ msg: "Password shouldn't be empty" })

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = new User({ fullName, email, password: hash, ...rest })
  await user.save()

  return res.send({ msg: "User Saved successfully" })
}

export async function login(
  this: FastifyInstance,
  req: loginReq,
  res: FastifyReply
) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.code(401).send("cannot find user in db")

    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).send({ msg: "password not matched" })

    const payload = { _id: user._id.toString(), role: user.role }
    const newToken = this.jwt.sign(payload, { expiresIn: "18h" })
    user.token = user.token.concat(newToken)
    await user.save()

    return res.send({ token: newToken })
  } catch (error) {
    return res.code(400).send({ error, msg: "User LogIn failed" })
  }
}

export async function me(req: FastifyRequest, res: FastifyReply) {
  try {
    const { password, token, ...rest } = req.user

    return res.send(rest)
  } catch (error) {
    return res.code(400).send({ error, msg: "Cannot find the user" })
  }
}

export async function logout(req: FastifyRequest, res: FastifyReply) {
  const { user, token } = req

  try {
    await User.updateOne({ _id: user._id }, { $pull: { token } })
    return res.send({ msg: "User Logged Out successfully" })
  } catch (error) {
    return res.code(400).send({ error, msg: "User LogOut failed" })
  }
}

export async function imgUpload(req: any, res: FastifyReply) {
  const { user: { _id } } = req
  const data = await req.file()

  if (!data) return res.code(400).send({ msg: 'No file uploaded' })

  try {
    const cloudinary = req.server.cloudinary
    const stream = Readable.from(await data.toBuffer())

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'my_uploads' },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.pipe(uploadStream)
    })

    await User.updateOne({ _id }, { $push: { images: result.url } })

    res.send({ msg: "User img uploaded successfully" })

  } catch (error) {
    return res.code(400).send({ error, msg: "Cannot upload image" })
  }
}

export async function getUsers(req: FastifyRequest, res: FastifyReply) {
  try {
    const users = await User.find()
    return res.send(users)

  } catch (error) {
    return res.code(400).send({ error, msg: "Users fetch error" })
  }
}

export async function getUser(req: FastifyRequest, res: FastifyReply) {
  const { user } = req

  try {
    const userDetails = await User.findOne({ _id: user._id })
    return res.send(userDetails)

  } catch (error) {
    return res.code(400).send({ error, msg: "Users fetch error" })
  }
}

export async function getMatches(req: FastifyRequest, res: FastifyReply) {
  const { gender }: any = req.body

  try {
    const getMatches = await User.find({ gender: gender === 'male' ? 'female' : 'male' })
    return res.send(getMatches)

  } catch (error) {
    return res.code(400).send({ error, msg: "Users fetch error" })
  }
}
