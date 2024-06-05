import { Static, Type } from '@sinclair/typebox';
import { bool, str, strArr } from './base.js';

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

export const registerShcema = Type.Object({
  fullName: Type.String({ minLength: 3 }),
  email: Type.String({ format: 'email' }),
  password: str,
  role: Type.Optional(Role)
})

export type registerShcemaType = Static<typeof registerShcema>

