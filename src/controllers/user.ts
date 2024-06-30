import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import axios from "axios";

import { loginReq, registerReq, uploadReq } from "../fastify-types/user.js";

import User from "../models/User.js";

export async function register(req: registerReq, res: FastifyReply) {
  const { fullName, email, password, ...rest } = req.body;

  const userExist = await User.findOne({ email }).select("_id");
  if (userExist)
    return res.status(400).send({ msg: "Email is already exists" });
  if (!password)
    return res.status(400).send({ msg: "Password shouldn't be empty" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ fullName, email, password: hash, ...rest });
  await user.save();

  return res.send({ msg: "User Saved successfully" });
}

export async function login(
  this: FastifyInstance,
  req: loginReq,
  res: FastifyReply
) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.code(401).send("cannot find user in db");

    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(400).send({ msg: "password not matched" });

    const payload = { _id: user._id.toString(), role: user.role };
    const newToken = this.jwt.sign(payload, { expiresIn: "18h" });
    user.token = user.token.concat(newToken);
    await user.save();

    return res.send({ token: newToken });
  } catch (error) {
    return res.code(400).send({ error, msg: "User LogIn failed" });
  }
}

export async function me(req: FastifyRequest, res: FastifyReply) {
  try {
    const { password, token, ...rest } = req.user;

    return res.send(rest);
  } catch (error) {
    return res.code(400).send({ error, msg: "Cannot find the user" });
  }
}

export async function logout(req: FastifyRequest, res: FastifyReply) {
  const { user, token } = req;

  try {
    await User.updateOne({ _id: user._id }, { $pull: { token } });
    return res.send({ msg: "User Logged Out successfully" });
  } catch (error) {
    return res.code(400).send({ error, msg: "User LogOut failed" });
  }
}

export async function imgUpload(this: FastifyInstance, req: any, res: FastifyReply) { //req: uploadReq
  try {
    const { image } = req.file;
    const user_id = req.user._id
    console.log(image);

    if (!image) {
      return res.code(400).send({ msg: "No image uploaded" });
    }

    cloudinary.config({
      cloud_name: this.config.CLOUDINARY_CLOUD_NAME,
      api_secret: this.config.CLOUDINARY_API_SECRET,
      api_key: this.config.CLOUDINARY_API_KEY,
      secure: true,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "images",
      },
      this.config.CLOUDINARY_API_SECRET
    );

    const data = new FormData();
    data.append("image", image.buffer, image.originalname);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", this.config.CLOUDINARY_API_KEY);
    data.append("images", "images");

    const api = `https://api.cloudinary.com/v1_1/${this.config.CLOUDINARY_CLOUD_NAME}/image/upload`;

    const axiosRes = await axios.post(api, data);
    const imageUrl = axiosRes.data.secure_url;

    await User.updateOne({ _id: user_id }, { $push: { otherImages: imageUrl } });

    return res.send({ msg: "Image uploaded successfully" })

  } catch (error) {
    return res.code(400).send({ error, msg: "User LogOut failed" });
  }
}
