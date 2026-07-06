export interface PortfolioItem {
  title: string
  description: string
}

export interface Specialist {
  id: number
  firstName: string
  lastName: string
  avatar: string
  city: string
  province: string
  experienceYears: number
  jobTitle: string
  industry: string
  skills: string[]
  machines: string[]
  brands: string[]
  certificates: string[]
  portfolio: PortfolioItem[]
  rating: number
  projectsCompleted: number
  availability: 'available' | 'busy'
  about: string
  languages: string[]
  profileCompletion: number
}

export type Availability = 'available' | 'busy'

export interface Filters {
  search: string
  city: string
  industry: string
  category: string
  experience: string
  machine: string
  brand: string
  availability: string
}
