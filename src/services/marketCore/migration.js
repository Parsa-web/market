import { SPECIALISTS_CATALOG } from '../../data/specialists'
import { marketStorage } from './storage'

function isMigrationComplete(userId) {
  return marketStorage.isMigrationComplete(userId)
}

function markMigrationComplete(userId) {
  marketStorage.markMigrationComplete(userId)
}

function getOldFactoryData(userId) {
  return marketStorage.getFactoryData(userId)
}

function getOldSpecialistData(userId) {
  return marketStorage.getSpecialistData(userId)
}

export function migrateSeedData(userId) {
  if (isMigrationComplete(userId)) return

  try {
    const existingRequests = marketStorage.getRequests()
    const existingApplications = marketStorage.getApplications()
    const existingConversations = marketStorage.getConversations()
    const existingMessages = marketStorage.getMessages()

    let needsSave = false

    // Migrate factory data
    const factoryData = getOldFactoryData(userId)
    if (factoryData) {
      // Migrate requests
      const newRequests = (factoryData.requests || []).filter(
        (r) => !existingRequests.some((er) => er.id === r.id)
      )
      if (newRequests.length > 0) {
        newRequests.forEach((r) => existingRequests.push(r))
        needsSave = true
      }

      // Migrate applications
      const newApplications = (factoryData.applications || []).filter(
        (a) => !existingApplications.some((ea) => ea.id === a.id)
      )
      if (newApplications.length > 0) {
        newApplications.forEach((a) => existingApplications.push(a))
        needsSave = true
      }

      // Migrate conversations
      if (factoryData.conversations) {
        factoryData.conversations.forEach((conv) => {
          const existing = existingConversations.find((ec) => ec.id === conv.id)
          if (!existing) {
            existingConversations.push(conv)
            needsSave = true
          }
        })
      }

      // Migrate messages
      if (factoryData.messages) {
        Object.entries(factoryData.messages).forEach(([convId, msgs]) => {
          if (!existingMessages[convId]) {
            existingMessages[convId] = msgs
            needsSave = true
          } else {
            const existingIds = new Set(existingMessages[convId].map((m) => m.id))
            const newMsgs = msgs.filter((m) => !existingIds.has(m.id))
            if (newMsgs.length > 0) {
              existingMessages[convId] = [...existingMessages[convId], ...newMsgs]
              needsSave = true
            }
          }
        })
      }
    }

    // Migrate specialist data
    const specialistData = getOldSpecialistData(userId)
    if (specialistData) {
      // Migrate applications
      const newApplications = (specialistData.applications || []).filter(
        (a) => !existingApplications.some((ea) => ea.id === a.id)
      )
      if (newApplications.length > 0) {
        newApplications.forEach((a) => existingApplications.push(a))
        needsSave = true
      }

      // Migrate conversations
      if (specialistData.conversations) {
        specialistData.conversations.forEach((conv) => {
          const existing = existingConversations.find((ec) => ec.id === conv.id)
          if (!existing) {
            existingConversations.push(conv)
            needsSave = true
          }
        })
      }

      // Migrate messages
      if (specialistData.messages) {
        Object.entries(specialistData.messages).forEach(([convId, msgs]) => {
          if (!existingMessages[convId]) {
            existingMessages[convId] = msgs
            needsSave = true
          } else {
            const existingIds = new Set(existingMessages[convId].map((m) => m.id))
            const newMsgs = msgs.filter((m) => !existingIds.has(m.id))
            if (newMsgs.length > 0) {
              existingMessages[convId] = [...existingMessages[convId], ...newMsgs]
              needsSave = true
            }
          }
        })
      }
    }

    if (needsSave) {
      marketStorage.setRequests(existingRequests)
      marketStorage.setApplications(existingApplications)
      marketStorage.setConversations(existingConversations)
      marketStorage.setMessages(existingMessages)
    }

    markMigrationComplete(userId)
  } catch {
    /* ignore migration errors */
  }
}

export function getDemoOpportunities() {
  return []
}

export function getSpecialistsCatalog() {
  return SPECIALISTS_CATALOG || []
}
