import type {
  ID, SpecialistProfile, Machine, Certificate, PortfolioItem, SpecialistSettings,
} from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

const DEFAULT_SETTINGS: SpecialistSettings = {
  emailNotifications: true,
  smsNotifications: true,
  newMessageAlert: true,
  applicationAlert: true,
  opportunityAlert: true,
}

export const specialistService = {
  async getByUserId(userId: ID): Promise<SpecialistProfile | undefined> {
    const profiles = await storageService.getByField<SpecialistProfile>(STORAGE_KEYS.SPECIALISTS, 'userId', userId)
    return profiles[0]
  },

  async getById(id: ID): Promise<SpecialistProfile | undefined> {
    return storageService.getById<SpecialistProfile>(STORAGE_KEYS.SPECIALISTS, id)
  },

  async getAll(): Promise<SpecialistProfile[]> {
    return storageService.getAll<SpecialistProfile>(STORAGE_KEYS.SPECIALISTS)
  },

  async update(userId: ID, changes: Partial<SpecialistProfile>): Promise<SpecialistProfile | undefined> {
    const profile = await this.getByUserId(userId)
    if (!profile) return undefined
    return storageService.update<SpecialistProfile>(STORAGE_KEYS.SPECIALISTS, profile.id, changes)
  },

  async getProfileCompletion(userId: ID): Promise<number> {
    const profile = await this.getByUserId(userId)
    if (!profile) return 0

    const checks = [
      !!profile.fullName,
      profile.specialties.length > 0,
      !!profile.experience,
      !!profile.city,
      !!(profile.introduction || profile.bio),
      !!profile.availability,
      profile.skills.length > 0,
      profile.machines.length > 0,
      profile.brands.length > 0,
      profile.certificates.length > 0,
    ]
    const done = checks.filter(Boolean).length
    return Math.round((done / checks.length) * 100)
  },

  async getMissingItems(userId: ID): Promise<{ label: string; path: string }[]> {
    const profile = await this.getByUserId(userId)
    const items: { label: string; path: string }[] = []
    if (!profile) return items
    if (!profile.fullName?.trim()) items.push({ label: 'تکمیل نام و نام خانوادگی', path: '/specialist/profile' })
    if (!profile.specialties?.length) items.push({ label: 'انتخاب تخصص اصلی', path: '/specialist/profile' })
    if (!profile.experience) items.push({ label: 'ثبت سال تجربه', path: '/specialist/profile' })
    if (!profile.city?.trim()) items.push({ label: 'ثبت شهر محل سکونت', path: '/specialist/profile' })
    if (!(profile.introduction || profile.bio)?.trim()) items.push({ label: 'معرفی حرفه‌ای خود', path: '/specialist/profile' })
    if (!profile.availability) items.push({ label: 'تعیین وضعیت شغلی', path: '/specialist/profile' })
    if (!profile.skills?.length) items.push({ label: 'افزودن مهارت', path: '/specialist/skills' })
    if (!profile.machines?.length) items.push({ label: 'افزودن تجربه دستگاه', path: '/specialist/machines' })
    if (!profile.brands?.length) items.push({ label: 'افزودن برندهای تخصصی', path: '/specialist/profile' })
    if (!profile.certificates?.length) items.push({ label: 'افزودن مدارک و گواهینامه‌ها', path: '/specialist/certificates' })
    return items
  },

  async getSkills(userId: ID): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    return profile?.skills || []
  },
  async addSkill(userId: ID, skill: string): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    if (!profile) return []
    const skills = [...(profile.skills || [])]
    const trimmed = skill.trim()
    if (!trimmed || skills.includes(trimmed)) return skills
    skills.push(trimmed)
    await this.update(userId, { skills })
    return skills
  },
  async updateSkill(userId: ID, index: number, newSkill: string): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    if (!profile) return []
    const skills = [...(profile.skills || [])]
    const trimmed = newSkill.trim()
    if (!trimmed || index < 0 || index >= skills.length) return skills
    skills[index] = trimmed
    await this.update(userId, { skills })
    return skills
  },
  async removeSkill(userId: ID, index: number): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    if (!profile) return []
    const skills = [...(profile.skills || [])]
    skills.splice(index, 1)
    await this.update(userId, { skills })
    return skills
  },

  async getMachines(userId: ID): Promise<Machine[]> {
    const profile = await this.getByUserId(userId)
    return profile?.machines || []
  },
  async addMachine(userId: ID, machine: Omit<Machine, 'id'>): Promise<Machine | null> {
    const profile = await this.getByUserId(userId)
    if (!profile) return null
    const newMachine: Machine = { ...machine, id: Date.now() + Math.random() }
    const machines = [...(profile.machines || []), newMachine]
    await this.update(userId, { machines })
    return newMachine
  },
  async updateMachine(userId: ID, machineId: ID, updates: Partial<Machine>): Promise<Machine | null> {
    const profile = await this.getByUserId(userId)
    if (!profile) return null
    const machines = [...(profile.machines || [])]
    const index = machines.findIndex(m => m.id === machineId)
    if (index === -1) return null
    machines[index] = { ...machines[index], ...updates }
    await this.update(userId, { machines })
    return machines[index]
  },
  async removeMachine(userId: ID, machineId: ID): Promise<void> {
    const profile = await this.getByUserId(userId)
    if (!profile) return
    const machines = (profile.machines || []).filter(m => m.id !== machineId)
    await this.update(userId, { machines })
  },

  async getBrands(userId: ID): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    return profile?.brands || []
  },
  async addBrand(userId: ID, brand: string): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    if (!profile) return []
    const brands = [...(profile.brands || [])]
    const trimmed = brand.trim()
    if (!trimmed || brands.includes(trimmed)) return brands
    brands.push(trimmed)
    await this.update(userId, { brands })
    return brands
  },
  async removeBrand(userId: ID, index: number): Promise<string[]> {
    const profile = await this.getByUserId(userId)
    if (!profile) return []
    const brands = [...(profile.brands || [])]
    brands.splice(index, 1)
    await this.update(userId, { brands })
    return brands
  },

  async getCertificates(userId: ID): Promise<Certificate[]> {
    const profile = await this.getByUserId(userId)
    return profile?.certificates || []
  },
  async addCertificate(userId: ID, cert: Omit<Certificate, 'id'>): Promise<Certificate | null> {
    const profile = await this.getByUserId(userId)
    if (!profile) return null
    const newCert: Certificate = {
      ...cert,
      id: Date.now() + Math.random(),
      uploadedAt: cert.uploadedAt || Date.now()
    }
    const certificates = [newCert, ...(profile.certificates || [])]
    await this.update(userId, { certificates })
    return newCert
  },
  async removeCertificate(userId: ID, certId: ID): Promise<void> {
    const profile = await this.getByUserId(userId)
    if (!profile) return
    const certificates = (profile.certificates || []).filter(c => c.id !== certId)
    await this.update(userId, { certificates })
  },

  async getPortfolio(userId: ID): Promise<PortfolioItem[]> {
    const profile = await this.getByUserId(userId)
    return profile?.portfolio || []
  },
  async addPortfolioItem(userId: ID, item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
    const profile = await this.getByUserId(userId)
    if (!profile) return null
    const newItem: PortfolioItem = { ...item, id: Date.now() + Math.random() }
    const portfolio = [newItem, ...(profile.portfolio || [])]
    await this.update(userId, { portfolio })
    return newItem
  },
  async removePortfolioItem(userId: ID, itemId: ID): Promise<void> {
    const profile = await this.getByUserId(userId)
    if (!profile) return
    const portfolio = (profile.portfolio || []).filter(p => p.id !== itemId)
    await this.update(userId, { portfolio })
  },

  async getSettings(userId: ID): Promise<SpecialistSettings> {
    const profile = await this.getByUserId(userId)
    return { ...DEFAULT_SETTINGS, ...(profile?.settings || {}) }
  },
  async updateSettings(userId: ID, updates: Partial<SpecialistSettings>): Promise<SpecialistSettings> {
    const profile = await this.getByUserId(userId)
    if (!profile) return { ...DEFAULT_SETTINGS, ...updates }
    const current = profile.settings || DEFAULT_SETTINGS
    const merged = { ...current, ...updates }
    await this.update(userId, { settings: merged })
    return merged
  },
}
