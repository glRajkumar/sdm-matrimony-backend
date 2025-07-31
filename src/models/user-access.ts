import { Schema, model } from 'mongoose';

const userAccessSchema = new Schema({
  viewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  viewed: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  paymentRefId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index - documents expire exactly at expiresAt time
  },

}, { timestamps: true })

userAccessSchema.index({ viewer: 1, viewed: 1, paymentRefId: 1 }, { unique: true })

const UserAccess = model('UserAccess', userAccessSchema)

export default UserAccess
