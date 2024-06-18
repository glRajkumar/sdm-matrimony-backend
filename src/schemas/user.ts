import { Static, Type } from "@sinclair/typebox";
import { bool, str, strArr, num } from "./base.js";

export const Role = Type.Union([
  Type.Literal("user"),
  Type.Literal("admin"),
  Type.Literal("broker"),
]);

export type RoleType = Static<typeof Role>;

export const User = Type.Object({
  fullName: Type.String({ minLength: 3 }),
  role: Role,
  email: Type.String({ format: "email" }),
  password: str,
  token: strArr,
  previewImg: str,
  otherImages: strArr,
  brokerAppointed: str,
  isMarried: bool,
  sex: str,
  dateofBirth: str,
  timeofBirth: str,
  placeofBirth: str,
  nakshatra: str,
  rasi: str,
  lagna: str,
  height: str,
  color: str,
  educationalQualification: str,
  work: str,
  salary: num,
  fatherName: str,
  motherName: str,
  brothers: num,
  sisters: num,
  birthOrder: num,
  expectation: str,
  formalities: str,
  houseType: str,
  currentLiving: str,
  dashaPeriod: str,
});

export type UserType = Static<typeof User>;

export const registerShcema = Type.Object({
  fullName: Type.String({ minLength: 3 }),
  email: Type.String({ format: "email" }),
  password: str,
  role: Type.Optional(Role),
});

export type registerShcemaType = Static<typeof registerShcema>;

export const loginShcema = Type.Object({
  email: Type.String({ format: "email" }),
  password: str,
});

export type loginShcemaType = Static<typeof loginShcema>;
