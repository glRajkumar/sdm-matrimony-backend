import { Static, Type } from '@sinclair/typebox';
import { FastifyRequest } from "fastify";

import { bool, str, strArr } from '../schemas/base.js';

export const Role = Type.Union([
  Type.Literal('user'),
  Type.Literal('admin'),
  Type.Literal('broker'),
]);

export const User = Type.Object({
  fullName: Type.String({ minLength: 3 }),
  role: Role,
  email: Type.String({ format: 'email' }),
  password: str,
  token: strArr,
  previewImg: str,
  otherImages: strArr,
  brokerAppointed: str,
  isMarried: bool,
})

export type UserType = Static<typeof User>

export const reqRegister = Type.Object({
  fullName: Type.String({ minLength: 3 }),
  email: Type.String({ format: 'email' }),
  password: str,
  role: Type.Optional(Role)
})

export type reqRegisterType = Static<typeof reqRegister>
export type fastReqRegister = FastifyRequest<{
  Body: reqRegisterType
}>

