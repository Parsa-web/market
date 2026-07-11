import { SEED_DATA } from './seedData'
import { marketStorage } from './storage'

const COLLECTIONS = [
  'users', 'factories', 'specialists', 'industrialRequests',
  'applications', 'projects', 'conversations', 'messages', 'notifications',
]

export function runMigration() {
  if (marketStorage.isMigrationComplete()) return

  for (const key of COLLECTIONS) {
    const raw = localStorage.getItem(`mk_${key}`)
    if (!raw) {
      const seed = SEED_DATA[key]
      if (seed) {
        localStorage.setItem(`mk_${key}`, JSON.stringify(seed))
      }
    }
  }

  marketStorage.markMigrationComplete()
}

export function migrateSeedData() {
  for (const key of COLLECTIONS) {
    const raw = localStorage.getItem(`mk_${key}`)
    if (!raw) {
      const seed = SEED_DATA[key]
      if (seed) {
        localStorage.setItem(`mk_${key}`, JSON.stringify(seed))
      }
    }
  }
}

export function getSpecialistsCatalog() {
  return SEED_DATA.specialists || []
}

export function getDemoOpportunities() {
  return SEED_DATA.industrialRequests || []
}
