import { api } from './storage'

async function enrichApplication(app) {
  const request = api.getById('industrialRequests', app.requestId)
  let specialistName = ''
  let factoryName = ''
  const spec = api.getById('specialists', app.specialistId)
  specialistName = spec?.fullName || ''
  if (request) {
    const factory = api.getById('factories', request.factoryId)
    factoryName = factory?.companyName || ''
  }
  return {
    ...app,
    factoryName: factoryName || 'کارخانه',
    specialistName: specialistName || `متخصص #${app.specialistId}`,
    requestTitle: request?.title || 'درخواست حذف شده',
    requestSpecialty: request?.industry || '',
    requestEquipment: request?.machine || '',
    requestBrand: request?.brand || '',
    requestCity: request?.location || '',
  }
}

function createNotification(userId, type, title, description) {
  api.post('notifications', {
    userId,
    type,
    title,
    description,
    read: false,
    createdAt: new Date().toISOString(),
  })
}

export const marketApplications = {
  async getAll() {
    return api.get('applications')
  },
  async getById(id) {
    return api.getById('applications', id)
  },
  async getByRequestId(requestId) {
    return api.getByRelated('applications', 'requestId', requestId)
  },
  async getBySpecialistId(specialistId) {
    return api.getByRelated('applications', 'specialistId', specialistId)
  },
  async getByFactoryUserId(userId) {
    const factories = api.getByRelated('factories', 'userId', userId)
    if (factories.length === 0) return []
    return this.getByFactoryId(factories[0].id)
  },
  async getByFactoryId(factoryId) {
    const all = await this.getAll()
    const requests = api.getByRelated('industrialRequests', 'factoryId', factoryId)
    const requestIds = requests.map(r => r.id)
    return all.filter(a => requestIds.includes(a.requestId))
  },
  async add(application) {
    const app = api.post('applications', { ...application, status: 'pending', createdAt: new Date().toISOString() })
    const request = api.getById('industrialRequests', application.requestId)
    const factories = api.getByRelated('factories', 'id', request.factoryId)
    const factory = factories[0]
    if (factory) {
      createNotification(
        factory.userId,
        'new_application',
        'درخواست همکاری جدید',
        `یک متخصص برای درخواست «${request.title}» اعلام آمادگی کرده است.`,
      )
    }
    return app
  },
  async updateStatus(id, status) {
    if (status === 'accepted') return this.accept(id)
    if (status === 'rejected') return this.reject(id)
    return api.patch('applications', id, { status })
  },
  async hasSpecialistApplied(specialistId, requestId) {
    const apps = await this.getBySpecialistId(specialistId)
    return apps.some(a => a.requestId === requestId)
  },
  async getForFactory(userId) {
    const apps = await this.getByFactoryUserId(userId)
    const enriched = []
    for (const app of apps) {
      enriched.push(await enrichApplication(app))
    }
    return enriched
  },
  async getForSpecialist(specialistId) {
    const apps = await this.getBySpecialistId(specialistId)
    const enriched = []
    for (const app of apps) {
      enriched.push(await enrichApplication(app))
    }
    return enriched
  },
  async accept(id) {
    const app = api.getById('applications', id)
    if (!app) return null
    const updated = api.patch('applications', id, { status: 'accepted' })
    const request = api.getById('industrialRequests', app.requestId)
    api.patch('industrialRequests', app.requestId, { status: 'in_progress' })
    const project = api.post('projects', {
      requestId: app.requestId,
      applicationId: id,
      factoryId: request.factoryId,
      specialistId: app.specialistId,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      createdAt: new Date().toISOString(),
    })
    api.post('conversations', {
      projectId: project.id,
      factoryId: request.factoryId,
      specialistId: app.specialistId,
      createdAt: new Date().toISOString(),
    })
    const factories = api.getByRelated('factories', 'id', request.factoryId)
    const factory = factories[0]
    const specialist = api.getById('specialists', app.specialistId)
    if (specialist) {
      createNotification(
        specialist.userId,
        'application_accepted',
        'درخواست شما پذیرفته شد',
        `درخواست شما برای «${request.title}» توسط ${factory?.companyName || 'کارخانه'} پذیرفته شد.`,
      )
      createNotification(
        specialist.userId,
        'project_started',
        'پروژه جدید شروع شد',
        `پروژه «${request.title}» شروع شد. لطفاً برای هماهنگی به بخش پیام‌ها مراجعه کنید.`,
      )
    }
    if (factory) {
      createNotification(
        factory.userId,
        'project_started',
        'پروژه جدید شروع شد',
        `پروژه «${request.title}» با همکاری ${specialist?.fullName || 'متخصص'} شروع شد.`,
      )
    }
    return updated
  },
  async reject(id) {
    const app = api.getById('applications', id)
    if (!app) return null
    const updated = api.patch('applications', id, { status: 'rejected' })
    const request = api.getById('industrialRequests', app.requestId)
    const specialist = api.getById('specialists', app.specialistId)
    if (specialist) {
      createNotification(
        specialist.userId,
        'application_rejected',
        'درخواست شما رد شد',
        `متأسفیم، درخواست شما برای «${request.title}» رد شده است.`,
      )
    }
    return updated
  },
  async getStats(factoryId) {
    const apps = await this.getByFactoryId(factoryId)
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
    }
  },
}
