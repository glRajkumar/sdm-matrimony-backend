import {
  randFullName, randEmail, randPassword, randNumber,
  randPastDate, randPhoneNumber, randStreetAddress,
  randCompanyName, randWord, randBoolean, randText,
  rand, toCollection,
} from "@ngneat/falso";

import castesMap from "../assets/caste-map.json" with { type: "json" };
import castes from "../assets/main-castes.json" with { type: "json" };

import {
  approvalStatuses, maritalStatuses, genders,
  nakshatra, raasi, religions,
  professions, educationLevels, languages,
  proffessionalSectors,
} from "../utils/index.js";

const generateRandomUser = () => {
  const gender = rand(genders)
  const noOfBrothers = randNumber({ min: 0, max: 5 })
  const noOfSisters = randNumber({ min: 0, max: 5 })
  const birthOrder = randNumber({ min: 1, max: noOfBrothers + noOfSisters + 1 })
  const minAge = randNumber({ min: 20, max: 30 })
  const maxAge = randNumber({ min: minAge, max: 45 })

  const profileImg = `https://randomuser.me/api/portraits/med/${gender === "Male" ? "men" : "women"}/${randNumber({ min: 1, max: 99 })}.jpg`
  const sector = rand(proffessionalSectors)
  const profession = sector === "Unemployed" ? "Unemployed" : rand(professions)
  const salary = sector === "Unemployed" ? 0 : randNumber({ min: 10000, max: 150000 })

  const caste = rand(castes)
  const found = castesMap[caste as keyof typeof castesMap] || []
  const subCaste = rand(found) || ""

  return {
    fullName: randFullName({ gender: gender.toLowerCase() as "male" | "female" }),
    email: randEmail(),
    password: randPassword(),
    maritalStatus: rand(maritalStatuses),
    isMarried: randBoolean(),
    gender,
    dob: randPastDate({ years: 30 }),
    contactDetails: {
      mobile: randPhoneNumber(),
      address: randStreetAddress(),
    },
    profileImg,
    proffessionalDetails: {
      highestQualification: rand(educationLevels),
      qualifications: randWord({ length: 10 }).join(' '),
      companyName: sector === "Unemployed" ? "" : randCompanyName(),
      profession,
      sector,
      salary,
    },
    familyDetails: {
      fatherName: randFullName({ gender: 'male' }),
      motherName: randFullName({ gender: 'female' }),
      noOfBrothers,
      noOfSisters,
      birthOrder,
      isFatherAlive: randBoolean(),
      isMotherAlive: randBoolean(),
    },
    approvalStatus: rand(approvalStatuses),
    vedicHoroscope: {
      nakshatra: rand(nakshatra),
      rasi: rand(raasi),
      lagna: rand(raasi),
      // dashaPeriod: randWord(),
      // placeOfBirth: randStreetAddress(),
      // timeOfBirth: `${randNumber({ min: 1, max: 12 })}:${randNumber({ min: 0, max: 59 })} ${randWord({ length: 1, dictionary: ['AM', 'PM'] })[0]}`,
      // vedicHoroscopePic: "",
    },
    partnerPreferences: {
      minAge,
      maxAge,
      caste,
      subCaste,
      religion: rand(religions),
      minSalary: randNumber({ min: 30000, max: 100000 }),
      minQualification: rand(educationLevels),
      profession: rand(professions),
      motherTongue: rand(languages),
      location: randStreetAddress(),
      expectation: randText({ charCount: 16 }),
      maritalStatus: rand(maritalStatuses),
    },
    otherDetails: {
      motherTongue: rand(languages),
      houseType: rand(['Own', 'Lease', 'Rental']),
      religion: rand(religions),
      height: randNumber({ min: 150, max: 200 }),
      color: randWord(),
      subCaste,
      caste,
    },
  };
};

export const randomUsers = () => toCollection(() => generateRandomUser(), { length: 200 })
