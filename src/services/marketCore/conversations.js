import { marketStorage } from './storage'

function syncConversationUnread(conversations, messages, currentUserId) {
  conversations.forEach((conv) => {
    const msgs = messages[conv.id] || []
    conv.unreadCount = msgs.filter((m) => !m.read && m.senderId !== currentUserId).length
  })
}

export const marketConversations = {
  getAll() {
    return marketStorage.getConversations()
  },

  getById(id) {
    const conversations = marketStorage.getConversations()
    return conversations.find((c) => c.id === id) || null
  },

  getByParticipantId(participantId) {
    const conversations = marketStorage.getConversations()
    return conversations.filter((c) => c.participantId === participantId)
  },

  getByBothParticipants(userId1, userId2) {
    const conversations = marketStorage.getConversations()
    return conversations.find(
      (c) =>
        (c.participantId === userId1 && c.creatorId === userId2) ||
        (c.participantId === userId2 && c.creatorId === userId1)
    ) || null
  },

  getOrCreate(userId1, userId2, creatorName, creatorRole, participantName, participantRole) {
    let conversation = this.getByBothParticipants(userId1, userId2)
    if (conversation) return conversation

    const conversations = marketStorage.getConversations()
    const newConversation = {
      id: marketStorage.generateId(),
      creatorId: userId1,
      creatorName,
      creatorRole,
      participantId: userId2,
      participantName,
      participantRole,
      lastMessage: '',
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    }
    conversations.unshift(newConversation)
    marketStorage.setConversations(conversations)
    return newConversation
  },

  getForUser(userId) {
    const conversations = marketStorage.getConversations()
    return conversations.filter(
      (c) => c.creatorId === userId || c.participantId === userId
    )
  },

  getForUserWithUnread(userId) {
    const conversations = this.getForUser(userId)
    const messages = marketStorage.getMessages()
    syncConversationUnread(conversations, messages, userId)
    return conversations
  },

  updateLastMessage(conversationId, content) {
    const conversations = marketStorage.getConversations()
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.lastMessage = content
      conv.lastMessageAt = Date.now()
      marketStorage.setConversations(conversations)
    }
  },

  markRead(conversationId, userId) {
    const conversations = marketStorage.getConversations()
    const messages = marketStorage.getMessages()
    const conv = conversations.find((c) => c.id === conversationId)
    const msgs = messages[conversationId] || []

    msgs.forEach((m) => {
      if (m.senderId !== userId) m.read = true
    })

    if (conv) conv.unreadCount = 0

    messages[conversationId] = msgs
    marketStorage.setConversations(conversations)
    marketStorage.setMessages(messages)
  },

  markAllRead(userId) {
    const conversations = marketStorage.getConversations()
    const messages = marketStorage.getMessages()

    conversations.forEach((conv) => {
      if (conv.creatorId === userId || conv.participantId === userId) {
        conv.unreadCount = 0
        const msgs = messages[conv.id] || []
        msgs.forEach((m) => {
          if (m.senderId !== userId) m.read = true
        })
      }
    })

    marketStorage.setConversations(conversations)
    marketStorage.setMessages(messages)
  },

  getUnreadPreviews(userId) {
    const conversations = this.getForUser(userId)
    const messages = marketStorage.getMessages()
    const previews = []

    conversations.forEach((conv) => {
      const msgs = messages[conv.id] || []
      msgs
        .filter((m) => !m.read && m.senderId !== userId)
        .forEach((m) => {
          previews.push({
            id: m.id,
            conversationId: conv.id,
            senderName: m.senderName,
            content: m.content,
            timestamp: m.timestamp,
          })
        })
    })

    return previews.sort((a, b) => b.timestamp - a.timestamp)
  },

  getUnreadCount(userId) {
    const conversations = this.getForUser(userId)
    const messages = marketStorage.getMessages()
    let total = 0

    conversations.forEach((conv) => {
      const msgs = messages[conv.id] || []
      total += msgs.filter((m) => !m.read && m.senderId !== userId).length
    })

    return total
  },
}

export const marketMessages = {
  getByConversationId(conversationId) {
    const messages = marketStorage.getMessages()
    return messages[conversationId] || []
  },

  add(conversationId, senderId, senderName, content) {
    const messages = marketStorage.getMessages()
    if (!messages[conversationId]) messages[conversationId] = []

    const newMessage = {
      id: marketStorage.generateId(),
      senderId,
      senderName,
      content,
      timestamp: Date.now(),
      read: false,
    }

    messages[conversationId].push(newMessage)
    marketStorage.setMessages(messages)

    marketConversations.updateLastMessage(conversationId, content)

    return newMessage
  },

  markRead(conversationId, messageId, userId) {
    const messages = marketStorage.getMessages()
    const msgs = messages[conversationId]
    if (!msgs) return false

    const msg = msgs.find((m) => m.id === messageId)
    if (!msg || msg.read || msg.senderId === userId) return false

    msg.read = true
    marketStorage.setMessages(messages)

    const conversations = marketStorage.getConversations()
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.unreadCount = msgs.filter((m) => !m.read && m.senderId !== userId).length
      marketStorage.setConversations(conversations)
    }

    return true
  },

  markAllInConversationRead(conversationId, userId) {
    const messages = marketStorage.getMessages()
    const msgs = messages[conversationId] || []

    msgs.forEach((m) => {
      if (m.senderId !== userId) m.read = true
    })

    messages[conversationId] = msgs
    marketStorage.setMessages(messages)

    const conversations = marketStorage.getConversations()
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.unreadCount = 0
      marketStorage.setConversations(conversations)
    }
  },
}
