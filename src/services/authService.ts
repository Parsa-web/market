import type { AuthSession, ID, User, UserRole } from '../types'
import { storageService } from './storage/storageService'
import { STORAGE_KEYS } from './storage/keys'

export interface RegisterData {
  identifier: string
  password: string
  role: UserRole
  fullName?: string
  phone?: string
  city?: string
  specialty?: string
  experience?: number
  skills?: string[]
  brands?: string[]
  companyName?: string
  industry?: string
  province?: string
  description?: string
}

export interface LoginResult {
  userId: ID
  role: UserRole
  profileId: ID
}

function isEmail(value: string): boolean {
  return value.includes('@')
}

export const authService = {
  async register(data: RegisterData): Promise<LoginResult> {
    const email = isEmail(data.identifier) ? data.identifier : `${data.identifier}@local`
    const phone = isEmail(data.identifier) ? (data.phone || '') : data.identifier

    const existing = await storageService.getByField<User>(STORAGE_KEYS.USERS, 'email', email)
    if (existing.length > 0) throw new Error('این ایمیل قبلاً ثبت شده است')

    if (phone) {
      const existingPhone = await storageService.getByField<User>(STORAGE_KEYS.USERS, 'phone', phone)
      if (existingPhone.length > 0) throw new Error('این شماره تلفن قبلاً ثبت شده است')
    }

    const user = await storageService.insert<User>(STORAGE_KEYS.USERS, {
      id: 0,
      email,
      phone,
      password: data.password,
      role: data.role,
      createdAt: new Date().toISOString(),
    })

    if (data.role === 'specialist') {
      const specialist = await storageService.insert(STORAGE_KEYS.SPECIALISTS, {
        id: 0,
        userId: user.id,
        fullName: data.fullName || '',
        phone: phone || data.phone || '',
        city: data.city || '',
        specialties: data.specialty ? [data.specialty] : [],
        skills: Array.isArray(data.skills) ? data.skills : (typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
        experience: data.experience ? parseInt(String(data.experience), 10) : 0,
        brands: Array.isArray(data.brands) ? data.brands : (typeof data.brands === 'string' ? data.brands.split(',').map(s => s.trim()).filter(Boolean) : []),
        bio: '',
        introduction: '',
        availability: 'آماده همکاری',
        machines: [],
        certificates: [],
        portfolio: [],
        profileViews: 0,
        settings: {
          emailNotifications: true,
          smsNotifications: true,
          newMessageAlert: true,
          applicationAlert: true,
          opportunityAlert: true,
        },
        createdAt: new Date().toISOString(),
      })

      const session: AuthSession = { userId: user.id, role: data.role, profileId: specialist.id }
      storageService.session.set(session)
      return { userId: user.id, role: data.role, profileId: specialist.id }
    } else {
      const factory = await storageService.insert(STORAGE_KEYS.FACTORIES, {
        id: 0,
        userId: user.id,
        companyName: data.companyName || '',
        industry: data.industry || '',
        city: data.city || '',
        phone: phone || data.phone || '',
        description: data.description || '',
        logo: '',
        province: data.province || '',
        createdAt: new Date().toISOString(),
      })

      const session: AuthSession = { userId: user.id, role: data.role, profileId: factory.id }
      storageService.session.set(session)
      return { userId: user.id, role: data.role, profileId: factory.id }
    }
  },

  async login(identifier: string, password: string): Promise<LoginResult> {
    const users = await storageService.getAll<User>(STORAGE_KEYS.USERS)
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password)
    if (!user) throw new Error('اطلاعات وارد شده صحیح نیست')

    let profileId = 0
    const profiles = await storageService.getByField(STORAGE_KEYS.SPECIALISTS, 'userId', user.id)
    if (profiles.length > 0) {
      profileId = profiles[0].id
    } else {
      const factoryProfiles = await storageService.getByField(STORAGE_KEYS.FACTORIES, 'userId', user.id)
      if (factoryProfiles.length > 0) profileId = factoryProfiles[0].id
    }

    const session: AuthSession = { userId: user.id, role: user.role, profileId }
    storageService.session.set(session)

    return { userId: user.id, role: user.role, profileId }
  },

  async deleteAccount(userId: ID, role: UserRole): Promise<void> {
    const profile = role === 'specialist'
      ? (await storageService.getOneByField(STORAGE_KEYS.SPECIALISTS, 'userId', userId))
      : (await storageService.getOneByField(STORAGE_KEYS.FACTORIES, 'userId', userId))
    const profileId = profile?.id

    if (profileId != null) {
      await storageService.remove(role === 'specialist' ? STORAGE_KEYS.SPECIALISTS : STORAGE_KEYS.FACTORIES, Number(profileId))
    }

    const specialistId = role === 'specialist' ? profileId : undefined
    const factoryUserId = role === 'factory' ? userId : undefined

    const conversations = await storageService.getByField(
      STORAGE_KEYS.CONVERSATIONS,
      role === 'specialist' ? 'specialistId' : 'factoryId',
      role === 'specialist' ? profileId || userId : userId
    )
    for (const conv of conversations) {
      const msgs = await storageService.getByField(STORAGE_KEYS.MESSAGES, 'conversationId', String(conv.id))
      for (const msg of msgs) {
        await storageService.remove(STORAGE_KEYS.MESSAGES, Number(msg.id))
      }
      await storageService.remove(STORAGE_KEYS.CONVERSATIONS, Number(conv.id))
    }

    const appField = role === 'specialist' ? 'specialistId' : 'factoryId'
    const appValue = role === 'specialist' ? (profileId || userId) : userId
    const apps = await storageService.getByField(STORAGE_KEYS.APPLICATIONS, appField, appValue)
    for (const app of apps) {
      await storageService.remove(STORAGE_KEYS.APPLICATIONS, Number(app.id))
    }

    await storageService.remove(STORAGE_KEYS.USERS, Number(userId))
    storageService.session.clear()
  },

  logout(): void {
    storageService.session.clear()
  },

  getSession(): AuthSession | null {
    return storageService.session.get()
  },

  isAuthenticated(): boolean {
    return storageService.session.exists()
  },
}
