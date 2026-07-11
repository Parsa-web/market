import { SEED_DATA } from './seedData'

const COLLECTIONS = [
  'users', 'factories', 'specialists', 'industrialRequests',
  'applications', 'projects', 'conversations', 'messages', 'notifications',
]

function getCollection(name) {
  try {
    const raw = localStorage.getItem(`mk_${name}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function setCollection(name, data) {
  localStorage.setItem(`mk_${name}`, JSON.stringify(data))
}

function ensureLoaded() {
  for (const key of COLLECTIONS) {
    if (!getCollection(key)) {
      setCollection(key, SEED_DATA[key] || [])
    }
  }
}

const api = {
  get(collection) {
    ensureLoaded()
    return getCollection(collection) || []
  },

  getById(collection, id) {
    ensureLoaded()
    const list = getCollection(collection) || []
    return list.find(item => item.id === id) || null
  },

  getByRelated(collection, foreignKey, foreignValue) {
    ensureLoaded()
    const list = getCollection(collection) || []
    const sv = String(foreignValue)
    return list.filter(item => String(item[foreignKey]) === sv)
  },

  getByQuery(collection, params) {
    ensureLoaded()
    let list = getCollection(collection) || []
    for (const [key, value] of Object.entries(params)) {
      const sv = String(value)
      list = list.filter(item => String(item[key]) === sv)
    }
    return list
  },

  post(collection, data) {
    ensureLoaded()
    const list = getCollection(collection) || []
    const id = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1
    const item = { id, ...data }
    list.push(item)
    setCollection(collection, list)
    return item
  },

  patch(collection, id, data) {
    ensureLoaded()
    const list = getCollection(collection) || []
    const index = list.findIndex(item => item.id === id)
    if (index === -1) return null
    list[index] = { ...list[index], ...data }
    setCollection(collection, list)
    return list[index]
  },

  put(collection, id, data) {
    ensureLoaded()
    const list = getCollection(collection) || []
    const index = list.findIndex(item => item.id === id)
    if (index === -1) return null
    list[index] = { id, ...data }
    setCollection(collection, list)
    return list[index]
  },

  del(collection, id) {
    ensureLoaded()
    const list = getCollection(collection) || []
    const index = list.findIndex(item => item.id === id)
    if (index === -1) return null
    const removed = list.splice(index, 1)[0]
    setCollection(collection, list)
    return removed
  },
}

export { api }

export const marketStorage = {
  KEYS: {},
  getSpecialistDataKey: (userId) => `mk_specialist_data_${userId}`,
  getFactoryDataKey: (userId) => `mk_factory_data_${userId}`,

  async getRequests() { return api.get('industrialRequests') },
  async setRequests(reqs) { setCollection('industrialRequests', reqs) },

  async getApplications() { return api.get('applications') },
  async setApplications(apps) { setCollection('applications', apps) },

  async getConversations() { return api.get('conversations') },
  async setConversations(convs) { setCollection('conversations', convs) },

  async getMessages() {
    const msgs = api.get('messages')
    const grouped = {}
    for (const m of msgs) {
      if (!grouped[m.conversationId]) grouped[m.conversationId] = []
      grouped[m.conversationId].push(m)
    }
    return grouped
  },
  async setMessages(msgs) { setCollection('messages', msgs) },

  async getSpecialistData(userId) {
    const specs = api.getByRelated('specialists', 'userId', userId)
    return specs[0] || null
  },
  async setSpecialistData(userId, data) {
    const specs = api.getByRelated('specialists', 'userId', userId)
    if (specs.length > 0) {
      api.patch('specialists', specs[0].id, data)
    }
  },

  async getFactoryData(userId) {
    const factories = api.getByRelated('factories', 'userId', userId)
    return factories[0] || null
  },
  async setFactoryData(userId, data) {
    const factories = api.getByRelated('factories', 'userId', userId)
    if (factories.length > 0) {
      api.patch('factories', factories[0].id, data)
    }
  },

  isMigrationComplete: () => !!localStorage.getItem('mk_migrated'),
  markMigrationComplete: () => localStorage.setItem('mk_migrated', '1'),
  generateId: () => Date.now(),
}
