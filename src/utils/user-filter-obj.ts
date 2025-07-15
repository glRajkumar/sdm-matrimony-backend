import { educationLevels } from "./enums.js";

function strOrArr(by: string, possibleLen: number) {
  const conBy = by?.includes("[") ? JSON.parse(by) : by.includes(",") ? by.split(",") : by
  if (typeof conBy === "string") return conBy

  if (Array.isArray(conBy) && conBy?.length < possibleLen) {
    return { $in: conBy }
  }

  return false
}

export function getFilterObj(obj: Record<string, any>) {
  const {
    gender, isMarried, salaryRange, ageRange, approvalStatus,
    minQualification, sector, profession, minSalary, motherTongue,
    rasi, lagna, maritalStatus, isBlocked, isDeleted,
    caste, religion, minAge, maxAge,
  } = obj

  const filter: any = {
    role: 'user',
    approvalStatus: 'approved',
    isBlocked: false,
    isDeleted: false,
    isMarried: false,
  }

  if (approvalStatus) {
    const approvalStatusFilter = strOrArr(approvalStatus, 3)
    if (approvalStatusFilter) {
      filter.approvalStatus = approvalStatusFilter
    }
    else {
      delete filter.approvalStatus
    }
  }

  if (gender) {
    const genderFilter = strOrArr(gender, 3)
    if (genderFilter) {
      filter.gender = genderFilter
    }
  }

  if (isMarried) {
    filter.isMarried = isMarried
  }

  if (isBlocked) {
    filter.isBlocked = isBlocked
    delete filter.approvalStatus
  }

  if (isDeleted) {
    filter.isDeleted = isDeleted
    delete filter.approvalStatus
  }

  if (maritalStatus) {
    const maritalStatusFilter = strOrArr(maritalStatus, 4)
    if (maritalStatusFilter) {
      filter.maritalStatus = maritalStatusFilter
    }
  }

  if (salaryRange) {
    const salaryList: any = {
      'below_20000': { $lt: 20000 },
      '20000_30000': { $gte: 20000, $lte: 30000 },
      '30000_40000': { $gte: 30000, $lte: 40000 },
      '40000_50000': { $gte: 40000, $lte: 50000 },
      'above_50000': { $gt: 50000 },
    }

    if (salaryList[salaryRange]) {
      filter["proffessionalDetails.salary"] = salaryList[salaryRange]
    }
  }

  if (minSalary) {
    filter["proffessionalDetails.salary"] = { $gte: Number(minSalary) }
  }

  if (minQualification && minQualification !== educationLevels[0]) {
    const applicableQualification = educationLevels.slice(educationLevels.indexOf(minQualification))
    filter["proffessionalDetails.highestQualification"] = {
      $in: applicableQualification
    }
  }

  if (sector) {
    filter["proffessionalDetails.sector"] = sector
  }

  if (profession) {
    filter["proffessionalDetails.profession"] = profession
  }

  if (ageRange) {
    const currentDate = new Date()
    const currYear = currentDate.getFullYear()
    const currMonth = currentDate.getMonth()
    const currDate = currentDate.getDate()

    const ageList: any = {
      'below_25': {
        $gte: new Date(currYear - 25, currMonth, currDate),
      },
      '25_30': {
        $gte: new Date(currYear - 30, currMonth, currDate),
        $lt: new Date(currYear - 25, currMonth, currDate)
      },
      '30_40': {
        $gte: new Date(currYear - 40, currMonth, currDate),
        $lt: new Date(currYear - 30, currMonth, currDate)
      },
      'above_40': {
        $lt: new Date(currYear - 40, currMonth, currDate)
      },
    };

    if (ageList[ageRange]) {
      filter.dob = ageList[ageRange]
    }
  }

  if (rasi) {
    const rasiFilter = strOrArr(rasi, 12)
    if (rasiFilter) {
      filter["vedicHoroscope.rasi"] = rasiFilter
    }
  }

  if (lagna) {
    const lagnaFilter = strOrArr(lagna, 12)
    if (lagnaFilter) {
      filter["vedicHoroscope.lagna"] = lagnaFilter
    }
  }

  if (caste) {
    const casteFilter = strOrArr(caste, 100)
    if (casteFilter) {
      filter["otherDetails.caste"] = casteFilter
    }
  }

  if (religion) {
    const religionFilter = strOrArr(religion, 100)
    if (religionFilter) {
      filter["otherDetails.religion"] = religionFilter
    }
  }

  if (motherTongue) {
    const motherTongueFilter = strOrArr(motherTongue, 100)
    if (motherTongueFilter) {
      filter["otherDetails.motherTongue"] = motherTongueFilter
    }
  }

  if (minAge) {
    const currentDate = new Date()
    const currYear = currentDate.getFullYear()
    const currMonth = currentDate.getMonth()
    const currDate = currentDate.getDate()

    filter.dob = {
      ...filter.dob,
      $lte: new Date(currYear - minAge, currMonth, currDate)
    }
  }

  if (maxAge) {
    const currentDate = new Date()
    const currYear = currentDate.getFullYear()
    const currMonth = currentDate.getMonth()
    const currDate = currentDate.getDate()

    filter.dob = {
      ...filter.dob,
      $gte: new Date(currYear - maxAge, currMonth, currDate)
    }
  }

  return filter
}
