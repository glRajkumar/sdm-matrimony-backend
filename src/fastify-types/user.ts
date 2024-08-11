import { FastifyRequest } from 'fastify';
import { Static } from '@sinclair/typebox';

import { _id } from '../schemas/base.js';
import {
  genderSchema,
  loginSchema,
  registerSchema,
  uploadSchema,
  User,
} from '../schemas/user.js';

export type userType = Static<typeof User>

export type registerReq = FastifyRequest<{
  Body: Static<typeof registerSchema>
}>

export type loginReq = FastifyRequest<{
  Body: Static<typeof loginSchema>
}>

export type uploadReq = FastifyRequest<{
  Body: Static<typeof uploadSchema>
}>

export type getUserDetailsReq = FastifyRequest<{
  Params: Static<typeof _id>
}>

export type getMatchesReq = FastifyRequest<{
  Params: Static<typeof genderSchema>
}>
