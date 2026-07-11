import { api } from './marketCore/storage'

export const authService = {
  async login(identifier, password) {
    const users = api.getByQuery('users', { email: identifier })
    const user = users.find(u => u.password === password)
    if (!user) throw new Error('اطلاعات وارد شده صحیح نیست')
    const session = { ...user }
    if (user.role === 'factory') {
      const factories = api.getByRelated('factories', 'userId', user.id)
      session.profile = factories[0] || null
    } else {
      const specialists = api.getByRelated('specialists', 'userId', user.id)
      session.profile = specialists[0] || null
    }
    sessionStorage.setItem('auth_session_token', JSON.stringify(session))
    sessionStorage.setItem('auth_session', JSON.stringify(session))
    return session
  },

  async register(data) {
    const { role, ...profileData } = data
    const existing = api.getByQuery('users', { email: data.email })
    if (existing.length > 0) throw new Error('این ایمیل قبلاً ثبت شده است')

    const user = api.post('users', {
      email: data.email,
      password: data.password,
      role,
      createdAt: new Date().toISOString(),
    })

    if (role === 'factory') {
      api.post('factories', {
        userId: user.id,
        companyName: profileData.companyName || '',
        industry: profileData.industry || '',
        province: profileData.province || '',
        city: profileData.city || '',
        description: profileData.description || '',
        logo: '',
        createdAt: new Date().toISOString(),
      })
    } else {
      api.post('specialists', {
        userId: user.id,
        fullName: profileData.fullName || '',
        profileImage: '',
        province: profileData.province || '',
        city: profileData.city || '',
        bio: profileData.bio || '',
        specialties: profileData.specialties || [],
        skills: profileData.skills || [],
        machines: profileData.machines || [],
        brands: profileData.brands || [],
        experience: profileData.experience || 0,
        certificates: [],
        portfolio: [],
        availabilityStatus: 'available',
        createdAt: new Date().toISOString(),
      })
    }
    return user
  },

  getSession() {
    try {
      const raw = sessionStorage.getItem('auth_session')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  logout() {
    sessionStorage.removeItem('auth_session')
    sessionStorage.removeItem('auth_session_token')
  },
}
