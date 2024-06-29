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
  gender: str,
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
});

export type UserType = Static<typeof User>;

export const registerShcema = Type.Optional(User);

export type registerShcemaType = Static<typeof registerShcema>;

export const loginShcema = Type.Object({
  email: Type.String({ format: "email" }),
  password: str,
});

export type loginShcemaType = Static<typeof loginShcema>;

export const uploadSchema = Type.Object({
  image:str,
})

export type uploadSchemaType = Static<typeof uploadSchema>;