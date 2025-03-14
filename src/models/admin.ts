import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name should atleast 3 letter'],
  },

  role: {
    type: String,
    enum: ['broker', 'admin'],
    default: 'broker',
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

  address: {
    type: String,
  },

  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  verifiyOtp: {
    type: Number
  },

}, { timestamps: true })

const Admin = model('Admin', adminSchema)

export default Admin
