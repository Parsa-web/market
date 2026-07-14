import type { ID, IndustrialRequest } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export const requestService = {
  async getAll(): Promise<IndustrialRequest[]> {
    return storageService.getAll<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS)
  },

  async getById(id: ID): Promise<IndustrialRequest | undefined> {
    return storageService.getById<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS, id)
  },

  async getByFactoryId(factoryId: ID): Promise<IndustrialRequest[]> {
    return storageService.getByField<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS, 'factoryId', factoryId)
  },

  async getActive(): Promise<IndustrialRequest[]> {
    const all = await storageService.getAll<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS)
    return all.filter(r => r.status === 'published' || r.status === 'waiting_for_applications')
  },

  async add(data: Omit<IndustrialRequest, 'id' | 'createdAt'>): Promise<IndustrialRequest> {
    return storageService.insert<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS, {
      ...data,
      id: 0,
      createdAt: new Date().toISOString(),
    })
  },

  async update(id: ID, changes: Partial<IndustrialRequest>): Promise<IndustrialRequest | undefined> {
    return storageService.update<IndustrialRequest>(STORAGE_KEYS.INDUSTRIAL_REQUESTS, id, changes)
  },

  async remove(id: ID): Promise<void> {
    await storageService.remove(STORAGE_KEYS.INDUSTRIAL_REQUESTS, id)
  },

  async getStats(factoryId: ID) {
    const requests = await this.getByFactoryId(factoryId)
    return {
      total: requests.length,
      active: requests.filter(r => r.status === 'published' || r.status === 'waiting_for_applications').length,
      inProgress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      draft: requests.filter(r => r.status === 'draft').length,
    }
  },

  async search(params: { skill?: string; machine?: string; brand?: string; city?: string }): Promise<IndustrialRequest[]> {
    let results = await this.getActive()
    if (params.skill) {
      const q = params.skill.toLowerCase()
      results = results.filter(r => r.skillsRequired?.some(s => s.toLowerCase().includes(q)))
    }
    if (params.machine) {
      const q = params.machine.toLowerCase()
      results = results.filter(r => r.machine?.toLowerCase().includes(q))
    }
    if (params.brand) {
      const q = params.brand.toLowerCase()
      results = results.filter(r => r.brand?.toLowerCase().includes(q))
    }
    if (params.city) {
      const q = params.city.toLowerCase()
      results = results.filter(r => r.location?.toLowerCase().includes(q))
    }
    return results
  },
}
