import { api } from './storage'

export const marketStats = {
  async getGlobalStats() {
    const users = api.get('users')
    const factories = api.get('factories')
    const specialists = api.get('specialists')
    const requests = api.get('industrialRequests')
    const projects = api.get('projects')

    return {
      totalUsers: users.length,
      totalFactories: factories.length,
      totalSpecialists: specialists.length,
      totalRequests: requests.length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
    }
  },

  async getHomeStats() {
    const users = api.get('users')
    const factories = api.get('factories')
    const specialists = api.get('specialists')
    const requests = api.get('industrialRequests')
    const projects = api.get('projects')

    return {
      totalFactories: factories.length,
      totalSpecialists: specialists.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      openRequests: requests.filter(r => r.status === 'published' || r.status === 'waiting_for_applications').length,
    }
  },

  async getFactoryStats(userId) {
    const factories = api.getByRelated('factories', 'userId', userId)
    const factory = factories[0]
    if (!factory) return { totalRequests: 0, activeRequests: 0, totalApplications: 0, totalProjects: 0 }
    return this.getFactoryDashboardStats(factory.id)
  },

  async getSpecialistStats(userId) {
    const specs = api.getByRelated('specialists', 'userId', userId)
    const specialist = specs[0]
    const apps = specialist ? api.getByRelated('applications', 'specialistId', specialist.id) : api.getByRelated('applications', 'specialistId', userId)
    const allAppIds = new Set(apps.map(a => a.requestId))
    const allRequests = api.get('industrialRequests')
    const activeRequests = allRequests.filter(r => !allAppIds.has(r.id) && (r.status === 'published' || r.status === 'waiting_for_applications'))

    return {
      totalApplications: apps.length,
      pendingApplications: apps.filter(a => a.status === 'pending').length,
      acceptedApplications: apps.filter(a => a.status === 'accepted').length,
      rejectedApplications: apps.filter(a => a.status === 'rejected').length,
      activeRequests: activeRequests.length,
    }
  },

  async getFactoryDashboardStats(factoryId) {
    const requests = api.getByRelated('industrialRequests', 'factoryId', factoryId)
    const applications = api.get('applications')
    const projects = api.get('projects')
    const requestIds = requests.map(r => r.id)
    const appCount = applications.filter(a => requestIds.includes(a.requestId)).length
    const projectCount = projects.filter(p => requestIds.includes(p.requestId)).length

    return {
      totalRequests: requests.length,
      activeRequests: requests.filter(r => r.status === 'published' || r.status === 'waiting_for_applications' || r.status === 'in_progress').length,
      totalApplications: appCount,
      totalProjects: projectCount,
    }
  },
}
