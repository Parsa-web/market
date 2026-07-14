import type { Conversation, ID, Message } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    return storageService.getAll<Conversation>(STORAGE_KEYS.CONVERSATIONS)
  },

  async getConversationByParticipants(factoryId: ID, specialistId: ID): Promise<Conversation | undefined> {
    const conversations = await this.getConversations()
    return conversations.find(c => c.factoryId === factoryId && c.specialistId === specialistId)
  },

  async getConversationById(id: ID): Promise<Conversation | undefined> {
    return storageService.getById<Conversation>(STORAGE_KEYS.CONVERSATIONS, id)
  },

  async getConversationsForUser(userId: ID): Promise<Conversation[]> {
    const conversations = await this.getConversations()
    return conversations.filter(c => c.factoryId === userId || c.specialistId === userId)
  },

  async getMessagesByConversationId(conversationId: ID): Promise<Message[]> {
    return storageService.getByField<Message>(STORAGE_KEYS.MESSAGES, 'conversationId', conversationId)
  },

  async addMessage(conversationId: ID, senderId: ID, text: string, file?: { name: string; data: string; size: number }): Promise<Message> {
    const msg: Record<string, unknown> = {
      id: 0,
      conversationId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    }
    if (file) {
      msg.fileName = file.name
      msg.fileData = file.data
      msg.fileSize = file.size
    }
    return storageService.insert<Message>(STORAGE_KEYS.MESSAGES, msg as Message)
  },

  async markAsRead(conversationId: ID): Promise<void> {
    const messages = await this.getMessagesByConversationId(conversationId)
    await Promise.all(messages.map(m =>
      storageService.update<Message>(STORAGE_KEYS.MESSAGES, m.id, { read: true })
    ))
  },

  async getUnreadCount(userId: ID): Promise<number> {
    const conversations = await this.getConversationsForUser(userId)
    let count = 0
    for (const conv of conversations) {
      const messages = await this.getMessagesByConversationId(conv.id)
      count += messages.filter(m => m.senderId !== userId && !m.read).length
    }
    return count
  },

  async getUnreadPreviews(userId: ID): Promise<{
    id: ID; conversationId: ID; senderName: string; timestamp: string; content: string
  }[]> {
    const conversations = await this.getConversationsForUser(userId)
    const [specialists, factories] = await Promise.all([
      storageService.getAll<{ id: ID; fullName: string }>(STORAGE_KEYS.SPECIALISTS),
      storageService.getAll<{ id: ID; companyName: string }>(STORAGE_KEYS.FACTORIES),
    ])

    const nameMap: Record<string, string> = {}
    specialists.forEach(s => { nameMap[String(s.id)] = s.fullName })
    factories.forEach(f => { nameMap[String(f.id)] = f.companyName })

    const previews = await Promise.all(conversations.map(async conv => {
      const messages = await this.getMessagesByConversationId(conv.id)
      const unread = messages.filter(m => m.senderId !== userId && !m.read)
      const last = messages[messages.length - 1]
      if (!last) return null
      return {
        id: last.id,
        conversationId: conv.id,
        senderName: nameMap[String(last.senderId)] || 'کاربر',
        timestamp: last.createdAt,
        content: last.text,
      }
    }))
    return previews.filter((p): p is NonNullable<typeof p> => p !== null)
  },
}
