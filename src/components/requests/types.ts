export type Urgency = 'high' | 'medium' | 'low'
export type RequestStatus = 'open' | 'closed' | 'in_progress'

export interface IndustrialRequest {
  id: number
  title: string
  factoryName: string
  industry: string
  machine: string
  brand: string
  city: string
  province: string
  requiredSkills: string[]
  description: string
  budget: string
  deadline: string
  urgency: Urgency
  status: RequestStatus
  applicationsCount: number
  estimatedDuration: string
  attachments: string[]
  createdAt: string
}

export interface RequestFilters {
  search: string
  industry: string
  machine: string
  brand: string
  province: string
  city: string
  skill: string
  urgency: string
  status: string
}
