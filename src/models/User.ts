import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name should atleast 3 letter'],
    },

    role: {
      type: String,
      enum: ['user', 'broker', 'admin'],
      default: 'user',
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email is not valid'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    token: [{ type: String }],

    images: [{ type: String }],

    brokerAppointed: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    isMarried: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
    },

    dob: {
      type: String,
      required: true,
      match: [
        /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d (0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Please use a valid date format: DD-MM-YYYY HH:MM AM/PM.',
      ],
    },

    placeOfBirth: {
      type: String,
    },

    nakshatra: {
      type: String,
    },

    rasi: {
      type: String,
    },

    lagna: {
      type: String,
    },

    qualification: {
      type: String,
    },

    work: {
      type: String,
    },

    salary: {
      type: Number,
    },

    fatherName: {
      type: String,
    },

    motherName: {
      type: String,
    },

    noOfBrothers: {
      type: Number,
    },

    noOfSisters: {
      type: Number,
    },

    birthOrder: {
      type: Number,
    },

    expectation: {
      type: String,
    },

    formalities: {
      type: String,
    },

    houseType: {
      type: String,
    },

    address: {
      type: String,
    },

    dashaPeriod: {
      type: String,
    },

    height: {
      type: String,
    },

    color: {
      type: String,
    },

    approval_required: {
      type: String,
      default: 'rejected',
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

export default User;
