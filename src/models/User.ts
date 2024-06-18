import { Optional } from "@sinclair/typebox";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name should atleast 3 letter"],
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
      match: [/\S+@\S+\.\S+/, "Email is not valid"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    token: [{ type: String }],

    previewImg: {
      type: String,
    },

    otherImages: [{ type: String }],

    brokerAppointed: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isMarried: {
      type: Boolean,
      default: false,
    },

    sex: {
      type: String,
      Optional,
    },

    dateofBirth: {
      type: String,
      Optional,
    },

    timeofBirth: {
      type: String,
      Optional,
    },

    placeofBirth: {
      type: String,
      Optional,
    },

    nakshatra: {
      type: String,
      Optional,
    },

    rasi: {
      type: String,
      Optional,
    },

    lagna: {
      type: String,
      Optional,
    },

    height: {
      type: String,
      Optional,
    },

    color: {
      type: String,
      Optional,
    },

    educationalQualification: {
      type: String,
      Optional,
    },

    work: {
      type: String,
      Optional,
    },

    salary: {
      type: Number,
      Optional,
    },

    fatherName: {
      type: String,
      Optional,
    },

    motherName: {
      type: String,
      Optional,
    },

    brothers: {
      type: Number,
      Optional,
    },

    sisters: {
      type: Number,
      Optional,
    },

    birthOrder: {
      type: Number,
      Optional,
    },

    expectation: {
      type: String,
      Optional,
    },

    formalities: {
      type: String,
      Optional,
    },

    houseType: {
      type: String,
      Optional,
    },

    currentLiving: {
      type: String,
      Optional,
    },

    dashaPeriod: {
      type: String,
      Optional,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
