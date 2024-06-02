import { FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';

import { fastReqRegister } from '../types/user.js';
import User from '../models/User.js';

export async function register(req: fastReqRegister, res: FastifyReply) {
  const { fullName, email, password } = req.body

  const userExist = await User.findOne({ email }).select("_id")
  if (userExist) return res.status(400).send({ msg: "Email is already exists" })
  if (!password) return res.status(400).send({ msg: "Password shouldn't be empty" })

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = new User({ fullName, email, password: hash })
  await user.save()

  return res.send({ msg: "User Saved successfully" })
}
