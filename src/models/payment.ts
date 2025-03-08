import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentId: {
    type: String,
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ['success', 'failed'],
    required: true,
  },

  paymentType: {
    type: String,
    enum: ['subscription', 'one-time'],
    required: true,
  },

  expiryDate: {
    type: Date,
  },

}, { timestamps: true })

const Payment = model('Payment', paymentSchema)

export default Payment
