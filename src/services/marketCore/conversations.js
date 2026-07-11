import { api } from './storage'

function getUserDisplayName(userId) {
  const user = api.getById('users', userId)
  if (!user) return `کاربر #${userId}`
  if (user.role === 'factory') {
    const factories = api.getByRelated('factories', 'userId', userId)
    return factories[0]?.companyName || user.email
  }
  const specialists = api.getByRelated('specialists', 'userId', userId)
  return specialists[0]?.fullName || user.email
}

function getProfileByUserId(userId) {
  const user = api.getById('users', userId)
  if (!user) return null
  if (user.role === 'factory') {
    const factories = api.getByRelated('factories', 'userId', userId)
    return factories[0] || null
  }
  const specialists = api.getByRelated('specialists', 'userId', userId)
  return specialists[0] || null
}

function resolveProfileId(userId) {
  const profile = getProfileByUserId(userId)
  return profile?.id || userId
}

function resolveParticipantNames(conv) {
  const factories = api.getByRelated('factories', 'id', conv.factoryId)
  const specialists = api.getByRelated('specialists', 'id', conv.specialistId)
  const factory = factories[0]
  const specialist = specialists[0]
  return {
    factoryName: factory?.companyName || 'کارخانه',
    specialistName: specialist?.fullName || 'متخصص',
  }
}

export const marketConversations = {
  async getAll() {
    return api.get('conversations')
  },
  async getById(id) {
    return api.getById('conversations', id)
  },
  async getByParticipantId(participantId) {
    const all = await this.getAll()
    return all.filter(c => c.factoryId === participantId || c.specialistId === participantId)
  },
  async getByBothParticipants(userId1, userId2) {
    const all = await this.getAll()
    return all.find(c =>
      (c.factoryId === userId1 && c.specialistId === userId2) ||
      (c.factoryId === userId2 && c.specialistId === userId1)
    ) || null
  },
  async getOrCreate(userId1, userId2, creatorName, creatorRole, participantName, participantRole) {
    let conv = await this.getByBothParticipants(userId1, userId2)
    if (conv) return conv
    return api.post('conversations', {
      factoryId: creatorRole === 'factory' ? userId1 : userId2,
      specialistId: creatorRole === 'specialist' ? userId1 : userId2,
      createdAt: new Date().toISOString(),
    })
  },
  async getForUser(userId) {
    const profileId = resolveProfileId(userId)
    return this.getByParticipantId(profileId)
  },
  async getForUserWithUnread(userId) {
    const conversations = await this.getForUser(userId)
    for (const conv of conversations) {
      const msgs = api.getByRelated('messages', 'conversationId', conv.id)
      conv.unreadCount = msgs.filter(m => m.senderId !== userId && !m.read).length
    }
    return conversations
  },
  async markRead(conversationId, userId) {
    const messages = api.getByRelated('messages', 'conversationId', conversationId)
    for (const m of messages) {
      if (m.senderId !== userId && !m.read) {
        api.patch('messages', m.id, { read: true })
      }
    }
  },
  async markAllRead(userId) {
    const conversations = await this.getForUser(userId)
    for (const conv of conversations) {
      await this.markRead(conv.id, userId)
    }
  },
  async getUnreadPreviews(userId) {
    const conversations = await this.getForUser(userId)
    const previews = []
    for (const conv of conversations) {
      const messages = api.getByRelated('messages', 'conversationId', conv.id)
      const unread = messages.filter(m => !m.read && m.senderId !== userId)
      for (const m of unread) {
        previews.push({
          id: m.id,
          conversationId: conv.id,
          senderName: getUserDisplayName(m.senderId),
          content: m.text,
          timestamp: new Date(m.createdAt).getTime(),
        })
      }
    }
    return previews.sort((a, b) => b.timestamp - a.timestamp)
  },
  async getUnreadCount(userId) {
    const conversations = await this.getForUser(userId)
    let total = 0
    for (const conv of conversations) {
      const msgs = api.getByRelated('messages', 'conversationId', conv.id)
      total += msgs.filter(m => m.senderId !== userId && !m.read).length
    }
    return total
  },
}

export const marketMessages = {
  async getByConversationId(conversationId) {
    return api.getByRelated('messages', 'conversationId', conversationId)
  },
  async add(conversationId, senderId, senderName, content) {
    const msg = api.post('messages', {
      conversationId,
      senderId,
      text: content,
      createdAt: new Date().toISOString(),
      read: false,
    })
    const conv = api.getById('conversations', conversationId)
    if (conv) {
      const factories = api.getByRelated('factories', 'id', conv.factoryId)
      const specialists = api.getByRelated('specialists', 'id', conv.specialistId)
      const factory = factories[0]
      const specialist = specialists[0]
      const notifUserId = factory && factory.userId !== senderId
        ? factory.userId
        : (specialist && specialist.userId !== senderId ? specialist.userId : null)
      if (notifUserId) {
        const requests = api.getByRelated('industrialRequests', 'factoryId', conv.factoryId)
        const requestTitle = requests[0]?.title || 'پروژه'
        api.post('notifications', {
          userId: notifUserId,
          type: 'new_message',
          title: 'پیام جدید',
          description: `پیام جدید در پروژه «${requestTitle}»`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      }
    }
    return msg
  },
  async markRead(conversationId, messageId, userId) {
    const msg = api.patch('messages', messageId, { read: true })
    return !!msg
  },
  async markAllInConversationRead(conversationId, userId) {
    const messages = api.getByRelated('messages', 'conversationId', conversationId)
    for (const m of messages) {
      if (m.senderId !== userId && !m.read) {
        api.patch('messages', m.id, { read: true })
      }
    }
  },
}
