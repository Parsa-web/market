import { authService } from './authService'

export const authApi = {
  getSession: () => {
    return authService.getSession()
  },

  login: async (credentials) => {
    const result = await authService.login(credentials.identifier, credentials.password)
    const profile = result.profile || {}
    const session = {
      id: result.id,
      email: result.email,
      role: result.role,
      ...profile,
      company: profile.companyName || result.email,
      fullName: profile.fullName || result.email,
      specialty: Array.isArray(profile.specialties) ? profile.specialties[0] || '' : '',
      identifier: result.email,
    }
    sessionStorage.setItem('auth_session', JSON.stringify(session))
    return session
  },

  register: async (data) => {
    const parseCSV = (v) => (typeof v === 'string' ? v.split(/[،,]/).map(s => s.trim()).filter(Boolean) : [])

    const specialty = data.specialty || ''
    const newUser = await authService.register({
      email: data.identifier,
      password: data.password,
      role: data.role,
      companyName: data.companyName,
      industry: data.industry,
      province: data.province || data.city,
      city: data.city,
      fullName: data.fullName,
      specialties: specialty ? [specialty] : [],
      skills: parseCSV(data.skills),
      machines: [],
      brands: parseCSV(data.brands),
      experience: data.experience ? parseInt(data.experience) : 0,
      description: data.description || '',
    })
    const session = {
      id: newUser.id,
      email: data.identifier,
      role: data.role,
      identifier: data.identifier,
      companyName: data.companyName,
      company: data.companyName,
      fullName: data.fullName,
      manager: data.manager,
      industry: data.industry,
      city: data.city,
      phone: data.phone,
      specialty,
      specialties: specialty ? [specialty] : [],
      experience: data.experience || '',
      availabilityStatus: 'available',
      bio: '',
    }
    sessionStorage.setItem('auth_session', JSON.stringify(session))
    return session
  },

  logout: () => {
    authService.logout()
  },

  updateUser: (userId, updates) => {
    const session = authService.getSession()
    if (!session) return null
    const updated = { ...session, ...updates }
    sessionStorage.setItem('auth_session', JSON.stringify(updated))
    return updated
  },
}
