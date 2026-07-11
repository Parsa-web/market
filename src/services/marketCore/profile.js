import { api } from './storage'
import { DEFAULT_SPECIALIST_SETTINGS } from './constants'

function load(userId) {
  let data = api.getByRelated('specialists', 'userId', userId)[0] || null
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
  else if (typeof data.skills === 'string') data.skills = data.skills.split(/[،,]/).map(s => s.trim()).filter(Boolean)
  if (!data.machines) data.machines = []
  if (!data.brands) data.brands = []
  else if (typeof data.brands === 'string') data.brands = data.brands.split(/[،,]/).map(s => s.trim()).filter(Boolean)
  if (!data.certificates) data.certificates = []
  if (!data.portfolio) data.portfolio = []
  data.settings = { ...DEFAULT_SPECIALIST_SETTINGS, ...(data.settings || {}) }
  if (data.settings.applicationsSeenAt === undefined) data.settings.applicationsSeenAt = 0
  if (data.profileViews === undefined) data.profileViews = 0
  return data
}

function getSpecialistByUserId(userId) {
  return api.getByRelated('specialists', 'userId', userId)[0] || null
}

export function calculateProfileCompletion(user, data) {
  const checks = [
    !!user?.fullName,
    !!(user?.specialties?.length > 0),
    !!user?.experience,
    !!user?.city,
    !!data?.introduction || !!user?.bio,
    !!data?.availability || user?.availabilityStatus,
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
  async getProfileData(userId, user) {
    const data = load(userId)
    return {
      ...data,
      profileCompletion: calculateProfileCompletion(user, data),
      missingItems: getMissingProfileItems(data),
    }
  },

  async updateProfileFields(userId, fields) {
    const spec = getSpecialistByUserId(userId)
    if (spec) {
      api.patch('specialists', spec.id, fields)
      return load(userId)
    }
    return fields
  },

  async incrementProfileViews(userId) {
    const spec = getSpecialistByUserId(userId)
    if (spec) {
      const views = (spec.profileViews || 0) + 1
      api.patch('specialists', spec.id, { profileViews: views })
      return views
    }
    return 0
  },

  async getSkills(userId) {
    return load(userId).skills
  },
  async addSkill(userId, skill) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return []
    const trimmed = skill.trim()
    const skills = [...(spec.skills || [])]
    if (!trimmed || skills.includes(trimmed)) return skills
    skills.push(trimmed)
    api.patch('specialists', spec.id, { skills })
    return skills
  },
  async updateSkill(userId, index, newSkill) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return []
    const skills = [...(spec.skills || [])]
    const trimmed = newSkill.trim()
    if (!trimmed || index < 0 || index >= skills.length) return skills
    skills[index] = trimmed
    api.patch('specialists', spec.id, { skills })
    return skills
  },
  async removeSkill(userId, index) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return []
    const skills = [...(spec.skills || [])]
    skills.splice(index, 1)
    api.patch('specialists', spec.id, { skills })
    return skills
  },

  async getMachines(userId) {
    return load(userId).machines
  },
  async addMachine(userId, machine) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return null
    const machines = [...(spec.machines || []), { ...machine, id: Date.now() + Math.random() }]
    api.patch('specialists', spec.id, { machines })
    return machines[machines.length - 1]
  },
  async updateMachine(userId, id, updates) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return null
    const machines = [...(spec.machines || [])]
    const index = machines.findIndex(m => m.id === id)
    if (index === -1) return null
    machines[index] = { ...machines[index], ...updates }
    api.patch('specialists', spec.id, { machines })
    return machines[index]
  },
  async removeMachine(userId, id) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return
    const machines = (spec.machines || []).filter(m => m.id !== id)
    api.patch('specialists', spec.id, { machines })
  },

  async getBrands(userId) {
    return load(userId).brands
  },
  async addBrand(userId, brand) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return []
    const trimmed = brand.trim()
    const brands = [...(spec.brands || [])]
    if (!trimmed || brands.includes(trimmed)) return brands
    brands.push(trimmed)
    api.patch('specialists', spec.id, { brands })
    return brands
  },
  async removeBrand(userId, index) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return []
    const brands = [...(spec.brands || [])]
    brands.splice(index, 1)
    api.patch('specialists', spec.id, { brands })
    return brands
  },

  async getCertificates(userId) {
    return load(userId).certificates
  },
  async addCertificate(userId, cert) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return null
    const newCert = { ...cert, id: Date.now() + Math.random(), uploadedAt: Date.now(), status: 'آپلود شده' }
    const certificates = [newCert, ...(spec.certificates || [])]
    api.patch('specialists', spec.id, { certificates })
    return newCert
  },
  async removeCertificate(userId, id) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return
    const certificates = (spec.certificates || []).filter(c => c.id !== id)
    api.patch('specialists', spec.id, { certificates })
  },

  async getPortfolio(userId) {
    return load(userId).portfolio
  },
  async addPortfolioItem(userId, item) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return null
    const newItem = { ...item, id: Date.now() + Math.random(), date: Date.now() }
    const portfolio = [newItem, ...(spec.portfolio || [])]
    api.patch('specialists', spec.id, { portfolio })
    return newItem
  },
  async removePortfolioItem(userId, id) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return
    const portfolio = (spec.portfolio || []).filter(p => p.id !== id)
    api.patch('specialists', spec.id, { portfolio })
  },

  async getSettings(userId) {
    return load(userId).settings
  },
  async updateSettings(userId, settings) {
    const spec = getSpecialistByUserId(userId)
    if (!spec) return settings
    const currentSettings = spec.settings || { ...DEFAULT_SPECIALIST_SETTINGS }
    const updated = { ...currentSettings, ...settings }
    api.patch('specialists', spec.id, { settings: updated })
    return updated
  },
}
