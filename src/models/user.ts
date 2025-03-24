import { Schema, model } from 'mongoose';

const maritalStatus = ['Single', 'Divorced', 'Widowed']

const planetSchema = {
  type: [{
    planet: String,
    degree: Number,
    sign: String,
  }],
  default: [],
}

const houseDetailSchema = {
  house1: planetSchema,
  house2: planetSchema,
  house3: planetSchema,
  house4: planetSchema,
  house5: planetSchema,
  house6: planetSchema,
  house7: planetSchema,
  house8: planetSchema,
  house9: planetSchema,
  house10: planetSchema,
  house11: planetSchema,
  house12: planetSchema,
}

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name should atleast 3 letter'],
  },

  role: {
    type: String,
    enum: ['user'],
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

  refreshTokens: [{ type: String }],

  images: [{ type: String }],

  profileImg: String,

  brokerAppointed: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },

  maritalStatus: {
    type: String,
    enum: maritalStatus,
    required: true
  },

  isMarried: { // true if user alliance is fixed
    type: Boolean,
    default: false,
  },

  marriedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  gender: {
    type: String,
    enum: ['Male', 'Female'], // 'Other'
  },

  dob: {
    type: Date,
    required: true,
  },

  contactDetails: {
    mobile: String,
    address: String,
  },

  proffessionalDetails: {
    highestQualification: String,
    qualifications: String,
    companyName: String,
    profession: String,
    salary: Number,
  },

  familyDetails: {
    fatherName: String,
    motherName: String,
    noOfBrothers: Number,
    noOfSisters: Number,
    birthOrder: Number,
    isFatherAlive: {
      type: Boolean,
      default: true,
    },
    isMotherAlive: {
      type: Boolean,
      default: true,
    },
  },

  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  verifiyOtp: Number,

  vedicHoroscope: {
    nakshatra: String,
    rasi: String,
    lagna: String,
    dashaPeriod: String,
    placeOfBirth: String,
    timeOfBirth: String,
    raasiChart: houseDetailSchema,
    navamsaChart: houseDetailSchema,
    vedicHoroscopePic: String,
  },

  partnerPreferences: {
    minAge: Number,
    maxAge: Number,
    religion: String,
    caste: String,
    minSalary: Number,
    minQualification: String,
    profession: String,
    motherTongue: String,
    location: String,
    expectation: String,
    maritalStatus: {
      type: String,
      enum: maritalStatus,
    },
  },

  otherDetails: {
    motherTongue: String,
    houseType: String,
    religion: String,
    height: String,
    color: String,
    caste: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  liked: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  disliked: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  payment: [{
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  }],

}, { timestamps: true })

const User = model('User', userSchema)

export default User
