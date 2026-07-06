import { marketStorage } from './storage'
import { CERTIFICATE_STATUS, DEFAULT_SPECIALIST_SETTINGS } from './constants'

function load(userId) {
  let data = marketStorage.getSpecialistData(userId)
  if (!data) {
    data = {
      profileViews: 0,
      introduction: '',
      availability: '',
      skills: [],
      machines: [],
      brands: [],
      certificates: [],
      portfolio: [],
      settings: { ...DEFAULT_SPECIALIST_SETTINGS },
    }
  }
  if (!data.skills) data.skills = []
  if (!data.machines) data.machines = []
  if (!data.brands) data.brands = []
  if (!data.certificates) data.certificates = []
  if (!data.portfolio) data.portfolio = []
  data.settings = { ...DEFAULT_SPECIALIST_SETTINGS, ...(data.settings || {}) }
  if (data.settings.applicationsSeenAt === undefined) data.settings.applicationsSeenAt = 0
  if (data.profileViews === undefined) data.profileViews = 0
  return data
}

function save(userId, data) {
  marketStorage.setSpecialistData(userId, data)
}

export function calculateProfileCompletion(user, data) {
  const checks = [
    !!user?.fullName,
    !!user?.specialty,
    !!user?.experience,
    !!user?.city,
    !!data?.introduction,
    !!data?.availability,
    (data?.skills?.length || 0) > 0,
    (data?.machines?.length || 0) > 0,
    (data?.brands?.length || 0) > 0,
    (data?.certificates?.length || 0) > 0,
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}

export function getMissingProfileItems(data) {
  const items = []
  if (!data?.machines?.length) {
    items.push({ label: 'افزودن تجربه دستگاه', path: '/specialist/machines' })
  }
  if (!data?.skills?.length) {
    items.push({ label: 'افزودن مهارت', path: '/specialist/skills' })
  }
  if (!data?.certificates?.length) {
    items.push({ label: 'افزودن مدارک', path: '/specialist/certificates' })
  }
  return items
}

export const marketProfile = {
  getProfileData(userId, user) {
    const data = load(userId)
    return {
      ...data,
      profileCompletion: calculateProfileCompletion(user, data),
      missingItems: getMissingProfileItems(data),
    }
  },

  updateProfileFields(userId, fields) {
    const data = load(userId)
    Object.assign(data, fields)
    save(userId, data)
    return data
  },

  incrementProfileViews(userId) {
    const data = load(userId)
    data.profileViews += 1
    save(userId, data)
    return data.profileViews
  },

  getSkills(userId) {
    return load(userId).skills
  },

  addSkill(userId, skill) {
    const data = load(userId)
    const trimmed = skill.trim()
    if (!trimmed || data.skills.includes(trimmed)) return data.skills
    data.skills.push(trimmed)
    save(userId, data)
    return data.skills
  },

  updateSkill(userId, index, newSkill) {
    const data = load(userId)
    const trimmed = newSkill.trim()
    if (!trimmed || index < 0 || index >= data.skills.length) return data.skills
    data.skills[index] = trimmed
    save(userId, data)
    return data.skills
  },

  removeSkill(userId, index) {
    const data = load(userId)
    data.skills.splice(index, 1)
    save(userId, data)
    return data.skills
  },

  getMachines(userId) {
    return load(userId).machines
  },

  addMachine(userId, machine) {
    const data = load(userId)
    const newMachine = { ...machine, id: Date.now() }
    data.machines.unshift(newMachine)
    save(userId, data)
    return newMachine
  },

  updateMachine(userId, id, updates) {
    const data = load(userId)
    const index = data.machines.findIndex((m) => m.id === id)
    if (index === -1) return null
    data.machines[index] = { ...data.machines[index], ...updates }
    save(userId, data)
    return data.machines[index]
  },

  removeMachine(userId, id) {
    const data = load(userId)
    data.machines = data.machines.filter((m) => m.id !== id)
    save(userId, data)
  },

  getBrands(userId) {
    return load(userId).brands
  },

  addBrand(userId, brand) {
    const data = load(userId)
    const trimmed = brand.trim()
    if (!trimmed || data.brands.includes(trimmed)) return data.brands
    data.brands.push(trimmed)
    save(userId, data)
    return data.brands
  },

  removeBrand(userId, index) {
    const data = load(userId)
    data.brands.splice(index, 1)
    save(userId, data)
    return data.brands
  },

  getCertificates(userId) {
    return load(userId).certificates
  },

  addCertificate(userId, cert) {
    const data = load(userId)
    const newCert = {
      ...cert,
      id: Date.now(),
      uploadedAt: Date.now(),
      status: cert.status || CERTIFICATE_STATUS.UPLOADED,
    }
    data.certificates.unshift(newCert)
    save(userId, data)
    return newCert
  },

  removeCertificate(userId, id) {
    const data = load(userId)
    data.certificates = data.certificates.filter((c) => c.id !== id)
    save(userId, data)
  },

  getPortfolio(userId) {
    return load(userId).portfolio
  },

  addPortfolioItem(userId, item) {
    const data = load(userId)
    const newItem = { ...item, id: Date.now(), date: Date.now() }
    data.portfolio.unshift(newItem)
    save(userId, data)
    return newItem
  },

  removePortfolioItem(userId, id) {
    const data = load(userId)
    data.portfolio = data.portfolio.filter((p) => p.id !== id)
    save(userId, data)
  },

  getSettings(userId) {
    return load(userId).settings
  },

  updateSettings(userId, settings) {
    const data = load(userId)
    data.settings = { ...data.settings, ...settings }
    save(userId, data)
    return data.settings
  },
}
