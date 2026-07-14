import type { FactoryProfile, ID } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export const factoryService = {
  async getByUserId(userId: ID): Promise<FactoryProfile | undefined> {
    const profiles = await storageService.getByField<FactoryProfile>(STORAGE_KEYS.FACTORIES, 'userId', userId)
    return profiles[0]
  },

  async getById(id: ID): Promise<FactoryProfile | undefined> {
    return storageService.getById<FactoryProfile>(STORAGE_KEYS.FACTORIES, id)
  },

  async getAll(): Promise<FactoryProfile[]> {
    return storageService.getAll<FactoryProfile>(STORAGE_KEYS.FACTORIES)
  },

  async update(userId: ID, changes: Partial<FactoryProfile>): Promise<FactoryProfile | undefined> {
    const profile = await this.getByUserId(userId)
    if (!profile) return undefined
    return storageService.update<FactoryProfile>(STORAGE_KEYS.FACTORIES, profile.id, changes)
  },

  async getProfileCompletion(userId: ID): Promise<number> {
    const profile = await this.getByUserId(userId)
    if (!profile) return 0

    const checks = [
      !!profile.companyName?.trim(),
      !!profile.industry?.trim(),
      !!profile.city?.trim(),
      !!profile.phone?.trim(),
      !!profile.description?.trim(),
      !!profile.province?.trim(),
    ]
    const done = checks.filter(Boolean).length
    return Math.round((done / checks.length) * 100)
  },

  async getMissingItems(userId: ID): Promise<{ label: string; path: string }[]> {
    const profile = await this.getByUserId(userId)
    const items: { label: string; path: string }[] = []
    if (!profile) return items
    if (!profile.companyName?.trim()) items.push({ label: 'تکمیل نام کارخانه', path: '/factory/profile' })
    if (!profile.industry?.trim()) items.push({ label: 'انتخاب صنعت', path: '/factory/profile' })
    if (!profile.city?.trim()) items.push({ label: 'ثبت شهر', path: '/factory/profile' })
    if (!profile.phone?.trim()) items.push({ label: 'ثبت شماره تماس', path: '/factory/profile' })
    if (!profile.description?.trim()) items.push({ label: 'معرفی کارخانه', path: '/factory/profile' })
    if (!profile.province?.trim()) items.push({ label: 'ثبت استان', path: '/factory/profile' })
    return items
  },
}
