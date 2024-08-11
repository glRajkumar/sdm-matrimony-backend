import { Type } from '@sinclair/typebox';
import { bool, str, strArr, num } from './base.js';

export const Role = Type.Union([
  Type.Literal('user'),
  Type.Literal('admin'),
  Type.Literal('broker'),
])

export const Gender = Type.Union([
  Type.Literal('male'),
  Type.Literal('female'),
  Type.Literal('other'),
])

export const ApprovalStatus = Type.Union([
  Type.Literal('pending'),
  Type.Literal('approved'),
  Type.Literal('rejected'),
])

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
  gender: Gender,
  dob: str,
  placeOfBirth: str,
  nakshatra: str,
  rasi: str,
  lagna: str,
  qualification: str,
  work: str,
  salary: num,
  fatherName: str,
  motherName: str,
  noOfBrothers: num,
  noOfSisters: num,
  birthOrder: num,
  expectation: str,
  formalities: str,
  houseType: str,
  address: str,
  dashaPeriod: str,
  height: str,
  color: str,
  approvalStatus: ApprovalStatus,
})

export const registerSchema = Type.Partial(User)

export const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: str,
})

export const uploadSchema = Type.Object({ file: Type.Any() })

export const genderSchema = Type.Object({ gender: Gender })

export const approvalStatusSchema = Type.Object({ approvalStatus: ApprovalStatus })
