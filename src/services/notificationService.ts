import type { Notification } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export const notificationService = {
  async getByUserId(userId: number): Promise<Notification[]> {
    return storageService.getByField<Notification>(STORAGE_KEYS.NOTIFICATIONS, 'userId', userId)
  },

  async getUnread(userId: number): Promise<Notification[]> {
    const all = await this.getByUserId(userId)
    return all.filter(n => !n.read)
  },

  async getUnreadCount(userId: number): Promise<number> {
    const unread = await this.getUnread(userId)
    return unread.length
  },

  async markAsRead(id: number): Promise<void> {
    await storageService.update<Notification>(STORAGE_KEYS.NOTIFICATIONS, id, { read: true })
  },

  async markAllAsRead(userId: number): Promise<void> {
    const notifications = await this.getByUserId(userId)
    await Promise.all(notifications.map(n =>
      storageService.update<Notification>(STORAGE_KEYS.NOTIFICATIONS, n.id, { read: true })
    ))
  },

  async add(data: {
    userId: number
    type: string
    title: string
    description: string
  }): Promise<Notification> {
    return storageService.insert<Notification>(STORAGE_KEYS.NOTIFICATIONS, {
      id: 0,
      userId: data.userId,
      type: data.type,
      title: data.title,
      description: data.description,
      read: false,
      createdAt: new Date().toISOString(),
    })
  },
}
