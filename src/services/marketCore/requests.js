import { marketStorage } from './storage'
import { APPLICATION_STATUS, REQUEST_STATUS } from './constants'

function enrichRequest(request, applications) {
  const requestApplications = applications.filter((a) => a.requestId === request.id)
  return {
    ...request,
    applicationCount: requestApplications.length,
    pendingApplicationCount: requestApplications.filter((a) => a.status === APPLICATION_STATUS.PENDING).length,
  }
}

export const marketRequests = {
  getAll() {
    return marketStorage.getRequests()
  },

  getById(id) {
    const requests = marketStorage.getRequests()
    return requests.find((r) => r.id === id) || null
  },

  getByUserId(userId) {
    const requests = marketStorage.getRequests()
    return requests.filter((r) => r.userId === userId)
  },

  getActive() {
    const requests = marketStorage.getRequests()
    return requests.filter((r) => r.status === REQUEST_STATUS.ACTIVE)
  },

  add(request) {
    const requests = marketStorage.getRequests()
    const newRequest = {
      ...request,
      id: marketStorage.generateId(),
      status: REQUEST_STATUS.ACTIVE,
      createdAt: Date.now(),
    }
    requests.unshift(newRequest)
    marketStorage.setRequests(requests)
    return newRequest
  },

  update(id, updates) {
    const requests = marketStorage.getRequests()
    const index = requests.findIndex((r) => r.id === id)
    if (index === -1) return null
    requests[index] = { ...requests[index], ...updates }
    marketStorage.setRequests(requests)
    return requests[index]
  },

  remove(id) {
    const requests = marketStorage.getRequests()
    marketStorage.setRequests(requests.filter((r) => r.id !== id))
  },

  getWithStats(userId) {
    const requests = marketStorage.getRequests()
    const applications = marketStorage.getApplications()
    const userRequests = userId ? requests.filter((r) => r.userId === userId) : requests
    return userRequests.map((r) => enrichRequest(r, applications))
  },

  getStats(userId) {
    const requests = marketStorage.getRequests()
    const userRequests = userId ? requests.filter((r) => r.userId === userId) : requests
    return {
      total: userRequests.length,
      active: userRequests.filter((r) => r.status === REQUEST_STATUS.ACTIVE).length,
      pending: userRequests.filter((r) => r.status === REQUEST_STATUS.PENDING).length,
      completed: userRequests.filter((r) => r.status === REQUEST_STATUS.COMPLETED).length,
      closed: userRequests.filter((r) => r.status === REQUEST_STATUS.CLOSED).length,
    }
  },
}
