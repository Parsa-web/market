import { marketStorage } from './storage'
import { marketRequests } from './requests'
import { marketApplications } from './applications'
import { calculateProfileCompletion } from './profile'
import { APPLICATION_STATUS, DEFAULT_FACTORY_SETTINGS, REQUEST_STATUS } from './constants'

export const marketStats = {
  getFactoryStats(userId) {
    const requests = marketRequests.getByUserId(userId)
    const applications = marketApplications.getByFactoryUserId(userId)

    const activeRequests = requests.filter(
      (r) => r.status === REQUEST_STATUS.ACTIVE || r.status === REQUEST_STATUS.PENDING
    ).length

    let unreadMessages = 0
    const messages = marketStorage.getMessages()
    const conversations = marketStorage.getConversations()

    conversations.forEach((conv) => {
      if (conv.creatorId === userId || conv.participantId === userId) {
        const msgs = messages[conv.id] || []
        unreadMessages += msgs.filter((m) => !m.read && m.senderId !== userId).length
      }
    })

    const pendingApplications = applications.filter(
      (a) => a.status === APPLICATION_STATUS.PENDING
    ).length

    const profileData = loadUserSettings(userId)
    const unreadApplications = applications.filter(
      (a) => (a.updatedAt || a.createdAt || 0) > (profileData.settings?.applicationsSeenAt || 0)
    ).length

    return {
      activeRequests,
      unreadMessages,
      unreadApplications,
      pendingApplications,
      totalApplications: applications.length,
    }
  },

  getSpecialistStats(userId, user) {
    const applications = marketApplications.getBySpecialistId(userId)

    let unreadMessages = 0
    const messages = marketStorage.getMessages()
    const conversations = marketStorage.getConversations()

    conversations.forEach((conv) => {
      if (conv.creatorId === userId || conv.participantId === userId) {
        const msgs = messages[conv.id] || []
        unreadMessages += msgs.filter((m) => !m.read && m.senderId !== userId).length
      }
    })

    const profileData = loadUserSettings(userId)
    const profileCompletion = calculateProfileCompletion(user, profileData)

    const pendingApplications = applications.filter(
      (a) => a.status === APPLICATION_STATUS.PENDING
    ).length
    const unreadApplicationUpdates = applications.filter(
      (a) => a.status !== APPLICATION_STATUS.PENDING && (a.updatedAt || a.createdAt || 0) > (profileData.settings?.applicationsSeenAt || 0)
    ).length

    return {
      pendingApplications,
      unreadApplicationUpdates,
      unreadMessages,
      profileViews: profileData.profileViews || 0,
      profileCompletion,
      totalApplications: applications.length,
    }
  },
}

function loadUserSettings(userId) {
  const specialistData = marketStorage.getSpecialistData(userId)
  if (specialistData?.settings) {
    return {
      settings: specialistData.settings,
      profileViews: specialistData.profileViews || 0,
    }
  }

  const factoryData = marketStorage.getFactoryData(userId)
  if (factoryData?.settings) {
    return {
      settings: factoryData.settings,
      profileViews: 0,
    }
  }

  return { settings: { ...DEFAULT_FACTORY_SETTINGS }, profileViews: 0 }
}
