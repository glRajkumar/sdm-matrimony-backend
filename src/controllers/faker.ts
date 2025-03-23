import {
  randFullName, randEmail, randPassword, randNumber,
  randPastDate, randPhoneNumber, randStreetAddress,
  randCompanyName, randWord, randBoolean, randLine,
  rand, randAvatar,
} from "@ngneat/falso";

import {
  approvalStatus, maritalStatus, gender,
  nakshatra, planets, raasi, castes, religions,
  professions, educationLevels,
} from '../utils/index.js';

const generatePlanetData = () => {
  return {
    planet: rand(planets),
    degree: randNumber({ min: 0, max: 30 }),
    sign: rand(raasi),
  };
};

const generateHouseDetails = () => {
  const houses: any = {}
  for (let i = 1; i <= 12; i++) {
    houses[`house${i}`] = [generatePlanetData()];
  }
  return houses;
};

const generateRandomUser = () => {
  return {
    fullName: randFullName(),
    email: randEmail(),
    password: randPassword(),
    maritalStatus: rand(maritalStatus),
    isMarried: randBoolean(),
    gender: rand(gender),
    dob: randPastDate({ years: 30 }), // Random date within the last 30 years
    contactDetails: {
      mobile: randPhoneNumber(),
      address: randStreetAddress(),
    },
    profileImg: randAvatar(),
    proffessionalDetails: {
      highestQualification: rand(educationLevels),
      qualifications: randWord({ length: 10 }).join(' '),
      companyName: randCompanyName(),
      profession: rand(professions),
      salary: randNumber({ min: 30000, max: 150000 }),
    },
    familyDetails: {
      fatherName: randFullName({ gender: 'male' }),
      motherName: randFullName({ gender: 'female' }),
      noOfBrothers: randNumber({ min: 0, max: 5 }),
      noOfSisters: randNumber({ min: 0, max: 5 }),
      birthOrder: randNumber({ min: 1, max: 5 }),
      isFatherAlive: randBoolean(),
      isMotherAlive: randBoolean(),
    },
    approvalStatus: rand(approvalStatus),
    vedicHoroscope: {
      nakshatra: rand(nakshatra),
      rasi: rand(raasi),
      lagna: rand(raasi),
      dashaPeriod: randWord(),
      placeOfBirth: randStreetAddress(),
      timeOfBirth: `${randNumber({ min: 1, max: 12 })}:${randNumber({ min: 0, max: 59 })} ${randWord({ length: 1, dictionary: ['AM', 'PM'] })[0]}`,
      raasiChart: generateHouseDetails(),
      navamsaChart: generateHouseDetails(),
      vedicHoroscopePic: "",
    },
    partnerPreferences: {
      minAge: randNumber({ min: 20, max: 30 }),
      maxAge: randNumber({ min: 30, max: 40 }),
      religion: randWord(),
      caste: randWord(),
      minSalary: randNumber({ min: 30000, max: 100000 }),
      minQualification: rand(educationLevels),
      profession: rand(professions),
      motherTongue: randWord(),
      location: randStreetAddress(),
      expectation: randLine(),
      maritalStatus: rand(maritalStatus),
    },
    otherDetails: {
      motherTongue: randWord(),
      houseType: rand(['Own', 'Lease', 'Rental']),
      height: randNumber({ min: 150, max: 200 }),
      color: randWord(),
      caste: rand(castes),
      religion: rand(religions),
    },
  };
};

const generateRandomUsers = (count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser());
  }
  return users;
};

export const randomUsers = generateRandomUsers(100)
