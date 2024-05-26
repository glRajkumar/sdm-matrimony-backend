import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name should atleast 3 letter"]
  },

  role: {
    type: String,
    enum: ["user", "broker", "admin"],
    default: "user",
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Email is not valid"]
  },

  password: {
    type: String,
    required: [true, "Password is required"]
  },

  token: [{ type: String }],

  previewImg: {
    type: String,
  },

  otherImages: [{ type: String }],

  brokerAppointed: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  isMarried: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

const User = model('User', userSchema)

export default User
