import { z } from "zod";

import {
  educationEnum, maritalStatusEnum, nakshatraEnum, rasiEnum,
  ageRangeEnum, salaryRangeEnum, imgFileSchema,
  genderEnum, otherDetailsSchema, familyDetailsSchema,
  vedicHoroscopeSchema, partnerPreferencesSchema, professionalDetailsSchema,
} from "./general.js";
import { enumQuery } from "./custom-validate.js";
import { isValidDob, MIN_AGE } from "../utils/index.js";

export const matchedUsersSchema = z.object({
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(10),
  minAge: z.coerce.number().optional(),
  maxAge: z.coerce.number().optional(),
  sector: z.string().optional(),
  profession: z.string().optional(),
  minSalary: z.coerce.number().optional(),
  ageRange: ageRangeEnum.optional(),
  salaryRange: salaryRangeEnum.optional(),
  rasi: enumQuery(rasiEnum).optional(),
  lagna: enumQuery(nakshatraEnum).optional(),
  caste: enumQuery(z.string()).optional(),
  subCaste: enumQuery(z.string()).optional(),
  religion: enumQuery(z.string()).optional(),
  motherTongue: enumQuery(z.string()).optional(),
  maritalStatus: enumQuery(maritalStatusEnum).optional(),
  minQualification: educationEnum.optional(),
})
  .refine((data) => {
    if (data.minAge && data.maxAge && data.minAge > data.maxAge) {
      return false
    }
    return true
  }, {
    message: "Minimum age must be less than maximum age",
    path: ["minAge"],
  })
  .optional()

export const userIdSchema = z.object({
  userId: z.string("User ID is required"),
})

export const updateProfileSchema = z.object({
  dob: z.iso.datetime(),
  gender: genderEnum,
  fullName: z.string("Name is required").min(3, "Name must be at least 3 characters"),
  images: z.array(z.url()).optional(),
  profileImg: z.union([z.url(), z.literal("")]).optional(),
  otherDetails: otherDetailsSchema,
  maritalStatus: maritalStatusEnum,
  familyDetails: familyDetailsSchema,
  vedicHoroscope: vedicHoroscopeSchema,
  partnerPreferences: partnerPreferencesSchema,
  proffessionalDetails: professionalDetailsSchema,
  _id: z.string().optional(),
  contactDetails: z.object({
    address: z.string().optional(),
  }).optional(),
})
  .partial()
  .refine(
    (data) => !data.dob || isValidDob(data.dob),
    {
      message: `User must be at least ${MIN_AGE} years old`,
      path: ["dob"],
    }
  )

export const imgUploadSchema = z.object({
  _id: z.string().optional(),
  isProfilePic: z.coerce.boolean().optional(),
  images: z.preprocess(
    (val) => Array.isArray(val) ? val : [val],
    z.array(imgFileSchema).min(1, "At least one image is required")
  ),
})
