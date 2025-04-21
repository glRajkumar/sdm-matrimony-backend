export * from "./enums.js";
export * from "./cloudinary.js";
export * from "./password.js";
export * from "./token.js";
export * from "./transporter.js";
export * from "./user-filter-obj.js";
export * from "./image-extractor.js";

export function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000)
  console.log(otp)
  return otp
}
