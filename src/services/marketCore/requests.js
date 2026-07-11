import { api } from './storage'

export const marketRequests = {
  async getAll() {
    return api.get('industrialRequests')
  },
  async getById(id) {
    return api.getById('industrialRequests', id)
  },
  async getByUserId(userId) {
    const factory = await this._getFactoryByUserId(userId)
    if (!factory) return []
    return api.getByRelated('industrialRequests', 'factoryId', factory.id)
  },
  async getActive() {
    const all = await this.getAll()
    return all.filter(r => r.status === 'published' || r.status === 'in_progress')
  },
  async add(request) {
    return api.post('industrialRequests', request)
  },
  async update(id, updates) {
    return api.patch('industrialRequests', id, updates)
  },
  async remove(id) {
    return api.del('industrialRequests', id)
  },
  async getWithStats(userId) {
    const requests = await this.getByUserId(userId)
    const applications = await api.get('applications')
    return requests.map(r => ({
      ...r,
      applicationCount: applications.filter(a => a.requestId === r.id).length,
      pendingApplicationCount: applications.filter(a => a.requestId === r.id && a.status === 'pending').length,
    }))
  },
  async getStats(userId) {
    const requests = await this.getByUserId(userId)
    return {
      total: requests.length,
      active: requests.filter(r => r.status === 'published' || r.status === 'waiting_for_applications' || r.status === 'in_progress').length,
      pending: requests.filter(r => r.status === 'waiting_for_applications').length,
      completed: requests.filter(r => r.status === 'completed').length,
      closed: requests.filter(r => r.status === 'cancelled').length,
    }
  },
  async _getFactoryByUserId(userId) {
    const factories = api.getByRelated('factories', 'userId', userId)
    return factories[0] || null
  },
}
