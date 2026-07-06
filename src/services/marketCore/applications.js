import { marketStorage } from './storage'
import { marketRequests } from './requests'
import { APPLICATION_STATUS } from './constants'

function enrichApplication(application) {
  const request = marketRequests.getById(application.requestId)
  return {
    ...application,
    requestTitle: request?.title || 'درخواست حذف شده',
    requestSpecialty: request?.specialty || '',
    requestEquipment: request?.equipment || '',
    requestBrand: request?.brand || '',
    requestCity: request?.city || '',
  }
}

export const marketApplications = {
  getAll() {
    return marketStorage.getApplications()
  },

  getById(id) {
    const applications = marketStorage.getApplications()
    return applications.find((a) => a.id === id) || null
  },

  getByRequestId(requestId) {
    const applications = marketStorage.getApplications()
    return applications.filter((a) => a.requestId === requestId)
  },

  getBySpecialistId(specialistId) {
    const applications = marketStorage.getApplications()
    return applications.filter((a) => a.specialistId === specialistId)
  },

  getByFactoryUserId(userId) {
    const requests = marketRequests.getByUserId(userId)
    const requestIds = new Set(requests.map((r) => r.id))
    const applications = marketStorage.getApplications()
    return applications.filter((a) => requestIds.has(a.requestId))
  },

  add(application) {
    const applications = marketStorage.getApplications()
    const newApplication = {
      ...application,
      id: marketStorage.generateId(),
      status: APPLICATION_STATUS.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    applications.unshift(newApplication)
    marketStorage.setApplications(applications)
    return newApplication
  },

  updateStatus(id, status) {
    const applications = marketStorage.getApplications()
    const app = applications.find((a) => a.id === id)
    if (!app) return null
    app.status = status
    app.updatedAt = Date.now()
    marketStorage.setApplications(applications)
    return app
  },

  hasSpecialistApplied(specialistId, requestId) {
    const applications = marketStorage.getApplications()
    return applications.some(
      (a) => a.specialistId === specialistId && a.requestId === requestId
    )
  },

  getForFactory(userId) {
    const applications = this.getByFactoryUserId(userId)
    return applications.map(enrichApplication)
  },

  getForSpecialist(specialistId) {
    const applications = this.getBySpecialistId(specialistId)
    return applications.map(enrichApplication)
  },

  getStats(userId, role) {
    const applications = role === 'factory'
      ? this.getByFactoryUserId(userId)
      : this.getBySpecialistId(userId)

    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === APPLICATION_STATUS.PENDING).length,
      accepted: applications.filter((a) => a.status === APPLICATION_STATUS.ACCEPTED).length,
      rejected: applications.filter((a) => a.status === APPLICATION_STATUS.REJECTED).length,
    }
  },
}
