import { Schema, model } from 'mongoose';
import { plans } from '../utils/enums.js';

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  amount: {
    type: Number,
    required: true,
  },

  subscribedTo: {
    type: String,
    enum: plans,
    default: 'basic',
  },

  paymentId: {
    type: String,
    required: true,
  },

  orderId: {
    type: String,
    required: true,
  },

  razorpayPaymentSignature: {
    type: String,
    required: true,
  },

  expiryDate: {
    type: Date,
  },

}, { timestamps: true })

const Payment = model('Payment', paymentSchema)

export default Payment
