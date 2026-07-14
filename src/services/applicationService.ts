import type { Application, Conversation, ID, Message, Notification } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export const applicationService = {
  async getAll(): Promise<Application[]> {
    return storageService.getAll<Application>(STORAGE_KEYS.APPLICATIONS)
  },

  async getById(id: ID): Promise<Application | undefined> {
    return storageService.getById<Application>(STORAGE_KEYS.APPLICATIONS, id)
  },

  async getByRequestId(requestId: ID): Promise<Application[]> {
    return storageService.getByField<Application>(STORAGE_KEYS.APPLICATIONS, 'requestId', requestId)
  },

  async getBySpecialistId(specialistId: ID): Promise<Application[]> {
    return storageService.getByField<Application>(STORAGE_KEYS.APPLICATIONS, 'specialistId', specialistId)
  },

  async getByFactoryId(factoryId: ID): Promise<Application[]> {
    return storageService.getByField<Application>(STORAGE_KEYS.APPLICATIONS, 'factoryId', factoryId)
  },

  async add(data: {
    requestId: ID
    factoryId: ID
    specialistId: ID
    message: string
    availableStartDate?: string
    additionalDescription?: string
  }): Promise<Application> {
    const app = await storageService.insert<Application>(STORAGE_KEYS.APPLICATIONS, {
      id: 0,
      requestId: data.requestId,
      factoryId: data.factoryId,
      specialistId: data.specialistId,
      message: data.message || '',
      availableStartDate: data.availableStartDate || '',
      additionalDescription: data.additionalDescription || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    const conversation = await storageService.insert<Conversation>(STORAGE_KEYS.CONVERSATIONS, {
      id: 0,
      projectId: Date.now(),
      factoryId: data.factoryId,
      specialistId: data.specialistId,
      createdAt: new Date().toISOString(),
    })

    await storageService.insert<Message>(STORAGE_KEYS.MESSAGES, {
      id: 0,
      conversationId: conversation.id,
      senderId: data.specialistId,
      text: data.message || 'درخواست همکاری ارسال شده است.',
      createdAt: new Date().toISOString(),
      read: false,
    })

    await storageService.insert<Notification>(STORAGE_KEYS.NOTIFICATIONS, {
      id: 0,
      userId: data.factoryId,
      type: 'new_application',
      title: 'درخواست همکاری جدید',
      description: 'یک متخصص برای نیاز صنعتی شما درخواست همکاری ارسال کرده است.',
      read: false,
      createdAt: new Date().toISOString(),
    })

    return app
  },

  async updateStatus(id: ID, status: Application['status']): Promise<Application | undefined> {
    const app = await this.getById(id)
    if (!app) return undefined

    const updated = await storageService.update<Application>(STORAGE_KEYS.APPLICATIONS, id, { status })

    if (status === 'accepted') {
      const req = await storageService.getById(STORAGE_KEYS.INDUSTRIAL_REQUESTS, app.requestId)
      if (req) {
        await storageService.update(STORAGE_KEYS.INDUSTRIAL_REQUESTS, req.id, { status: 'in_progress' })
      }

      const conversations = await storageService.getByField<Conversation>(STORAGE_KEYS.CONVERSATIONS, 'factoryId', app.factoryId)
      const conv = conversations.find(c => String(c.specialistId) === String(app.specialistId))
      if (conv) {
        await storageService.insert<Message>(STORAGE_KEYS.MESSAGES, {
          id: 0,
          conversationId: conv.id,
          senderId: app.factoryId,
          text: 'درخواست همکاری شما پذیرفته شد. لطفاً برای هماهنگی بیشتر پیام دهید.',
          createdAt: new Date().toISOString(),
          read: false,
        })
      }

      await storageService.insert<Notification>(STORAGE_KEYS.NOTIFICATIONS, {
        id: 0,
        userId: app.specialistId,
        type: 'application_accepted',
        title: 'درخواست شما پذیرفته شد',
        description: 'کارخانه درخواست همکاری شما را پذیرفت. پیام‌ها را بررسی کنید.',
        read: false,
        createdAt: new Date().toISOString(),
      })
    }

    if (status === 'rejected') {
      await storageService.insert<Notification>(STORAGE_KEYS.NOTIFICATIONS, {
        id: 0,
        userId: app.specialistId,
        type: 'application_rejected',
        title: 'درخواست شما رد شد',
        description: 'متأسفانه کارخانه درخواست همکاری شما را رد کرد.',
        read: false,
        createdAt: new Date().toISOString(),
      })
    }

    return updated
  },

  async getStats(userId: ID, role: 'specialist' | 'factory') {
    const apps = role === 'specialist'
      ? await this.getBySpecialistId(userId)
      : await this.getByFactoryId(userId)
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    }
  },
}
