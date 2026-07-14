export type UserRole = 'specialist' | 'factory'

export type ID = number | string

export interface AuthSession {
  userId: ID
  role: UserRole
  profileId: ID
}

export interface User {
  id: ID
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export interface SpecialistProfile {
  id: ID
  userId: ID
  fullName: string
  phone: string
  city: string
  specialties: string[]
  skills: string[]
  experience: number
  brands: string[]
  bio: string
  introduction: string
  availability: string
  machines: Machine[]
  certificates: Certificate[]
  portfolio: PortfolioItem[]
  profileViews: number
  settings: SpecialistSettings
  createdAt: string
}

export interface Machine {
  id: ID
  name: string
  brand: string
  industry: string
  years: string
  description: string
}

export interface Certificate {
  id: ID
  name: string
  type: string
  status: string
  uploadedAt: number
  fileName?: string
  fileType?: string
  fileSize?: number
  fileData?: string
}

export interface PortfolioItem {
  id: ID
  title: string
  description: string
  industry: string
  machines: string[]
  brands: string[]
  completionDate: number
  images: { name: string; url: string }[]
}

export interface SpecialistSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  newMessageAlert: boolean
  applicationAlert: boolean
  opportunityAlert: boolean
}

export interface FactoryProfile {
  id: ID
  userId: ID
  companyName: string
  industry: string
  city: string
  phone: string
  description: string
  logo: string
  province: string
  createdAt: string
}

export interface IndustrialRequest {
  id: ID
  factoryId: ID
  title: string
  description: string
  industry: string
  machine: string
  brand: string
  location: string
  skillsRequired: string[]
  experienceLevel: string
  budget: string
  requiredTime: string
  applicationDeadline: string
  priority: string
  status: RequestStatus
  createdAt: string
}

export type RequestStatus = 'draft' | 'published' | 'waiting_for_applications' | 'in_progress' | 'completed' | 'cancelled'

export interface Application {
  id: ID
  requestId: ID
  factoryId: ID
  specialistId: ID
  message: string
  availableStartDate: string
  additionalDescription: string
  status: ApplicationStatus
  createdAt: string
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface Message {
  id: ID
  conversationId: ID
  senderId: ID
  text: string
  createdAt: string
  read: boolean
  fileName?: string
  fileData?: string
  fileSize?: number
}

export interface Conversation {
  id: ID
  projectId: number
  factoryId: ID
  specialistId: ID
  createdAt: string
}

export interface Notification {
  id: ID
  userId: ID
  type: string
  title: string
  description: string
  read: boolean
  createdAt: string
}
