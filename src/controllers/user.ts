import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Readable } from "stream";
import bcrypt from "bcryptjs";

import type {
  getMatchesReq,
  getUserDetailsReq,
  loginReq,
  registerReq,
  userType,
} from "../fastify-types/user.js";

import User from "../models/User.js";

export async function register(req: registerReq, res: FastifyReply) {
  try {
    const { fullName, email, password, ...rest } = req.body

    const userExist = await User.findOne({ email }).select("_id")
    if (userExist) return res.status(400).send({ msg: "Email is already exists" })
    if (!password) return res.status(400).send({ msg: "Password shouldn't be empty" })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({ fullName, email, password: hash, ...rest })
    await user.save()

    return res.send({ msg: "User Saved successfully" })

  } catch (error) {
    return res.code(400).send({ error, msg: "User registration failed" })
  }
}

export async function login(this: FastifyInstance, req: loginReq, res: FastifyReply) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.code(401).send("cannot find user in db")

    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).send({ msg: "password not matched" })

    const payload = { _id: user._id.toString(), role: user.role }
    const newToken = this.jwt.sign(payload, { expiresIn: "18h" })
    user.token = user.token.concat(newToken)
    await user.save()

    let output = {
      token: newToken,
      id: user?._id,
      email: user?.email,
      fullName: user?.fullName,
      gender: user?.gender,
      role: user?.role,
      approvalStatus: user?.approvalStatus,
    }

    return res.send(output)

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
  try {
    const { user, token } = req

    await User.updateOne({ _id: user._id }, { $pull: { token } })
    return res.send({ msg: "User Logged Out successfully" })

  } catch (error) {
    return res.code(400).send({ error, msg: "User LogOut failed" })
  }
}

export async function imgUpload(req: any, res: FastifyReply) {
  try {
    const { _id } = req.user
    const data = await req.file()

    if (!data) return res.code(400).send({ msg: "No file uploaded" })

    const cloudinary = req.server.cloudinary
    const stream = Readable.from(await data.toBuffer())

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "my_uploads" },
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

export async function getUserDetails(req: getUserDetailsReq, res: FastifyReply) {
  try {
    const { _id } = req.params
    const userDetails = await User.findOne({ _id }).select("-token -password")
    return res.send(userDetails)

  } catch (error) {
    return res.code(400).send({ error, msg: "getUserDetails error" })
  }
}

export async function getMatches(req: getMatchesReq, res: FastifyReply) {
  try {
    const { gender,marriedStatus,salaryRange,rasi,age } = req.body

    const filter: any = {
      role: "user",
      approvalStatus: "approved",
    }

    if (gender) {
      filter.gender = gender === "male" ? "female" : "male";
    }

    if (marriedStatus) {
      filter.isMarried = marriedStatus
    }

    if (!!salaryRange) {
      switch (salaryRange) {
        case 'below_20000':
          filter.salary = { $lt: 20000 }
          break;
          case '20000_30000':
            filter.salary = {  $gte: 20000, $lte: 30000  };
            break;
          case '30000_40000':
            filter.salary = { $gte: 30000, $lte: 40000  };
            break;
          case '40000_50000':
            filter.salary = { $gte: 40000, $lte: 50000};
            break;
          case 'above_50000':
            filter.salary = {  $gt: 50000 };
            break;
          default:
            filter.salary = {};
      }
    }
    
    if (age) {
      switch (age) {
        case 'below_25':
          filter.age = { $lt: 25 };
          break;
        case '25_30':
          filter.age = { $gte: 25, $lte: 30 };
          break;
        case '30_40':
          filter.age = { $gte: 30, $lte: 40 };
          break;
        case 'above_40':
          filter.age = { $gt: 40 };
          break;
        default:
          break;
      }
    }
    
    if (age) {   
      filter.rasi = { $in: rasi }
    }


    const getMatches = await User.find(filter)
      .select("-token -password")
      .lean()

    return res.send(getMatches)

  } catch (error) {
    return res.code(400).send({ error, msg: "getMatches error" })
  }
}
