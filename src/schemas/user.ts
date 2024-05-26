import { FastifySchema } from 'fastify';

import { bool, str, strArr, successMsg } from "./base.js";
import { filterByKeys } from '../utils/obj-manupluation.js';

const userSchema = {
  fullName: str,
  role: { ...str, enum: ["user", "broker", "admin"] },
  email: { ...str, format: 'email' },
  password: str,
  token: strArr,
  previewImg: str,
  otherImages: strArr,
  brokerAppointed: str,
  isMarried: bool,
}

export const registerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['fullName', 'email', 'password'],
    properties: filterByKeys(userSchema, ['fullName', 'email', 'password', "role"]),
    additionalProperties: false
  },
  response: {
    200: successMsg
  }
}
