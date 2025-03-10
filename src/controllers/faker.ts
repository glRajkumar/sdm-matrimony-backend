import {
  randFullName, randEmail, randPassword, randNumber,
  randPastDate, randPhoneNumber, randStreetAddress,
  randJobTitle, randCompanyName, randWord,
  randBoolean, randLine, rand, randAvatar,
} from "@ngneat/falso";

const gender = ['Male', 'Female', 'Other'];
const approvalStatus = ['pending', 'approved', 'rejected'];
const maritalStatus = ['Single', 'Divorced', 'Widowed'];
const nakshatra = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const raasi = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

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
      qualification: randWord({ length: 2 }).join(' '),
      salary: randNumber({ min: 30000, max: 150000 }),
      work: randJobTitle() + " " + randCompanyName(),
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
      salary: randNumber({ min: 30000, max: 100000 }),
      qualification: randWord(),
      work: randJobTitle(),
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
