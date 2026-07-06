import { getSpecialistsCatalog } from '../services/marketCore'
import { specialties } from '../data/specialties'

const SPECIALTY_SEARCH_TERMS = specialties.flatMap((item) => [
  item.title,
  item.example,
  item.id,
])

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

function getRegisteredSpecialists() {
  try {
    const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
    return users
      .filter((user) => user.role === 'specialist')
      .map((user) => {
        const devices = parseList(user.devices)
        const brands = parseList(user.brands)
        return {
          id: `reg-${user.id}`,
          userId: user.id,
          name: user.fullName || 'متخصص',
          role: user.specialty || 'متخصص فنی',
          specialty: user.specialty || '',
          skills: devices.length > 0 ? devices : [user.specialty].filter(Boolean),
          machines: devices,
          brands,
          experience: user.experience ? `${user.experience} سال` : '',
          city: user.city || '',
          verified: false,
          initials: getInitials(user.fullName),
          phone: user.phone || user.identifier || '',
          source: 'registered',
        }
      })
  } catch {
    return []
  }
}

export function getAllSpecialists() {
  const SPECIALISTS_CATALOG = getSpecialistsCatalog()
  const catalog = SPECIALISTS_CATALOG.map((item) => ({ ...item, source: 'catalog' }))
  const registered = getRegisteredSpecialists()

  const catalogKeys = new Set(
    catalog.flatMap((item) => [
      normalizeSearchText(item.name),
      item.phone ? normalizeSearchText(item.phone) : '',
    ]).filter(Boolean)
  )

  const uniqueRegistered = registered.filter((item) => {
    const nameKey = normalizeSearchText(item.name)
    const phoneKey = normalizeSearchText(item.phone)
    return !catalogKeys.has(nameKey) && !(phoneKey && catalogKeys.has(phoneKey))
  })

  return [...catalog, ...uniqueRegistered]
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
    ...(specialist.machines || []),
    ...(specialist.brands || []),
    ...SPECIALTY_SEARCH_TERMS,
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
    const machines = (specialist.machines || []).map(normalizeSearchText)
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
