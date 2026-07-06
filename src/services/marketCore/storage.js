const STORAGE_PREFIX = 'market_'
const SPECIALIST_DATA_PREFIX = 'specialist_data_'
const FACTORY_DATA_PREFIX = 'factory_data_'
const MIGRATION_PREFIX = 'market_migration_complete_'

const KEYS = {
  requests: `${STORAGE_PREFIX}requests`,
  applications: `${STORAGE_PREFIX}applications`,
  conversations: `${STORAGE_PREFIX}conversations`,
  messages: `${STORAGE_PREFIX}messages`,
}

function getSpecialistDataKey(userId) {
  return `${SPECIALIST_DATA_PREFIX}${userId}`
}

function getFactoryDataKey(userId) {
  return `${FACTORY_DATA_PREFIX}${userId}`
}

function getMigrationKey(userId) {
  return `${MIGRATION_PREFIX}${userId}`
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function write(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function readRaw(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function getCollection(key) {
  return read(key) || []
}

function setCollection(key, data) {
  write(key, data)
}

function getObject(key) {
  return read(key) || {}
}

function setObject(key, data) {
  write(key, data)
}

function generateId() {
  return Date.now() + Math.random()
}

export const marketStorage = {
  KEYS,
  getSpecialistDataKey,
  getFactoryDataKey,

  getRequests() {
    return getCollection(KEYS.requests)
  },

  setRequests(requests) {
    setCollection(KEYS.requests, requests)
  },

  getApplications() {
    return getCollection(KEYS.applications)
  },

  setApplications(applications) {
    setCollection(KEYS.applications, applications)
  },

  getConversations() {
    return getCollection(KEYS.conversations)
  },

  setConversations(conversations) {
    setCollection(KEYS.conversations, conversations)
  },

  getMessages() {
    return getObject(KEYS.messages)
  },

  setMessages(messages) {
    setObject(KEYS.messages, messages)
  },

  getSpecialistData(userId) {
    return read(getSpecialistDataKey(userId))
  },

  setSpecialistData(userId, data) {
    return write(getSpecialistDataKey(userId), data)
  },

  getFactoryData(userId) {
    return read(getFactoryDataKey(userId))
  },

  setFactoryData(userId, data) {
    return write(getFactoryDataKey(userId), data)
  },

  isMigrationComplete(userId) {
    return readRaw(getMigrationKey(userId)) === 'true'
  },

  markMigrationComplete(userId) {
    return writeRaw(getMigrationKey(userId), 'true')
  },

  generateId,
}
