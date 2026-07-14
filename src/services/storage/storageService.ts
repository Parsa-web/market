import type { AuthSession, ID } from '../../types'
import { STORAGE_KEYS } from './keys'
import { apiClient } from '../api/apiClient'

function keyToEndpoint(key: string): string {
  const map: Record<string, string> = {
    [STORAGE_KEYS.USERS]: 'users',
    [STORAGE_KEYS.SPECIALISTS]: 'specialists',
    [STORAGE_KEYS.FACTORIES]: 'factories',
    [STORAGE_KEYS.INDUSTRIAL_REQUESTS]: 'industrialRequests',
    [STORAGE_KEYS.APPLICATIONS]: 'applications',
    [STORAGE_KEYS.MESSAGES]: 'messages',
    [STORAGE_KEYS.NOTIFICATIONS]: 'notifications',
    [STORAGE_KEYS.CONVERSATIONS]: 'conversations',
  }
  return map[key] || key
}

function normalizeIds<T extends Record<string, unknown>>(item: T): T {
  if (item && typeof item === 'object' && 'id' in item) {
    const num = Number(item.id)
    const id = !isNaN(num) ? num : item.id
    return { ...item, id } as T
  }
  return item
}

function normalizeArray<T extends Record<string, unknown>>(items: T[]): T[] {
  if (!Array.isArray(items)) return []
  return items.map(normalizeIds)
}

export const storageService = {
  async getAll<T>(key: string): Promise<T[]> {
    const data = await apiClient.get<T[]>(`/${keyToEndpoint(key)}`)
    return normalizeArray(data as Record<string, unknown>[]) as T[]
  },

  async getById<T extends { id: ID }>(key: string, id: ID): Promise<T | undefined> {
    try {
      const data = await apiClient.get<Record<string, unknown>>(`/${keyToEndpoint(key)}/${id}`)
      return normalizeIds(data) as T
    } catch {
      return undefined
    }
  },

  async getByField<T>(key: string, field: string, value: unknown): Promise<T[]> {
    const data = await apiClient.get<T[]>(`/${keyToEndpoint(key)}?${field}=${encodeURIComponent(String(value))}`)
    return normalizeArray(data as Record<string, unknown>[]) as T[]
  },

  async getOneByField<T>(key: string, field: string, value: unknown): Promise<T | undefined> {
    const results = await this.getByField<T>(key, field, value)
    return results[0]
  },

  async insert<T>(key: string, item: T): Promise<T> {
    const data = await apiClient.post<Record<string, unknown>>(`/${keyToEndpoint(key)}`, item)
    return normalizeIds(data) as T
  },

  async insertWithId<T extends { id: ID }>(key: string, item: T): Promise<T> {
    const data = await apiClient.post<Record<string, unknown>>(`/${keyToEndpoint(key)}`, item)
    return normalizeIds(data) as T
  },

  async update<T extends { id: ID }>(key: string, id: ID, changes: Partial<T>): Promise<T> {
    const data = await apiClient.patch<Record<string, unknown>>(`/${keyToEndpoint(key)}/${id}`, changes)
    return normalizeIds(data) as T
  },

  async remove(key: string, id: number): Promise<void> {
    await apiClient.del(`/${keyToEndpoint(key)}/${id}`)
  },

  async count(key: string): Promise<number> {
    const items = await this.getAll(key)
    return items.length
  },

  async search<T>(key: string, predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll<T>(key)
    return items.filter(predicate)
  },

  session: {
    get(): AuthSession | null {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION)
        return raw ? JSON.parse(raw) as AuthSession : null
      } catch { return null }
    },

    set(session: AuthSession): void {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session))
    },

    clear(): void {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION)
    },

    exists(): boolean {
      return !!sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION)
    },
  },
}
