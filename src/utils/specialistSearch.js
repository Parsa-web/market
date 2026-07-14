import { specialistService } from '../services/specialistService'

function parseList(value) {
  if (!value) return []
  return String(value)
    .split(/[,،]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function normalizeSearchText(text) {
  if (!text) return ''
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u00a0]/g, ' ')
    .replace(/\s+/g, ' ')
}

function getInitials(name) {
  if (!name) return 'مت'
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export function getAllSpecialists() {
  try {
    const profiles = specialistService.getAll()
    return (profiles || []).map((profile) => ({
      id: `reg-${profile.id}`,
      userId: profile.userId,
      name: profile.fullName || 'متخصص',
      role: profile.specialties?.[0] || 'متخصص فنی',
      specialty: profile.specialties?.[0] || '',
      skills: profile.skills || [],
      machines: profile.machines || [],
      brands: profile.brands || [],
      experience: profile.experience ? `${profile.experience} سال` : '',
      city: profile.city || '',
      verified: false,
      initials: getInitials(profile.fullName),
      phone: profile.phone || '',
      source: 'registered',
    }))
  } catch {
    return []
  }
}

function buildSearchableText(specialist) {
  return [
    specialist.name,
    specialist.role,
    specialist.specialty,
    specialist.city,
    specialist.phone,
    specialist.experience,
    ...(specialist.skills || []),
    ...(specialist.machines || []).map(m => (typeof m === 'string' ? m : m.name || '')),
    ...(specialist.brands || []),
    'PLC', 'SCADA', 'HMI', 'Zelio', 'اتوماسیون', 'برق صنعتی', 'مکانیک', 'هیدرولیک', 'پنوماتیک', 'CNC', 'تعمیرات صنعتی', 'ابزار دقیق', 'تأسیسات', 'رباتیک صنعتی', 'توربین',
  ]
    .filter(Boolean)
    .map(normalizeSearchText)
    .join(' ')
}

function matchesQuery(specialist, query) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true

  const haystack = buildSearchableText(specialist)
  const terms = normalizedQuery.split(' ').filter(Boolean)

  return terms.every((term) => haystack.includes(term))
}

function matchesFilters(specialist, filters) {
  const { specialty, equipment, brand, city, experience } = filters

  if (specialty) {
    const specialtyNorm = normalizeSearchText(specialty)
    const specialistSpecialty = normalizeSearchText(specialist.specialty || '')
    const specialistRole = normalizeSearchText(specialist.role || '')
    if (specialistSpecialty !== specialtyNorm && !specialistRole.includes(specialtyNorm)) {
      return false
    }
  }

  if (equipment) {
    const equipmentNorm = normalizeSearchText(equipment)
    const machines = (specialist.machines || []).map(m => normalizeSearchText(typeof m === 'string' ? m : m.name || ''))
    const skills = (specialist.skills || []).map(normalizeSearchText)
    const hasEquipment = machines.some((m) => m.includes(equipmentNorm))
      || skills.some((s) => s.includes(equipmentNorm))
    if (!hasEquipment) return false
  }

  if (brand) {
    const brandNorm = normalizeSearchText(brand)
    const brands = (specialist.brands || []).map(normalizeSearchText)
    if (!brands.some((b) => b.includes(brandNorm))) return false
  }

  if (city) {
    const cityNorm = normalizeSearchText(city)
    if (!normalizeSearchText(specialist.city || '').includes(cityNorm)) return false
  }

  if (experience) {
    const minYears = parseInt(experience, 10)
    const years = parseInt(String(specialist.experience).replace(/[^\d]/g, ''), 10)
    if (!Number.isNaN(minYears) && (Number.isNaN(years) || years < minYears)) return false
  }

  return true
}

export function searchSpecialists(filters = {}) {
  const { query = '', ...rest } = filters
  return getAllSpecialists().filter(
    (specialist) => matchesFilters(specialist, rest) && matchesQuery(specialist, query)
  )
}

export function getSpecialistById(id) {
  return getAllSpecialists().find((item) => item.id === id || String(item.id) === String(id))
}
