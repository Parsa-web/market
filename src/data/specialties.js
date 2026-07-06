import specialtiesData from './specialties.json'

export const specialties = specialtiesData.specialties

export const specialtyTitles = specialties.map((item) => item.title)

export const specialtyExamples = specialties.map((item) => item.example)

export function getSpecialtyPlaceholder() {
  const samples = specialties.slice(0, 2).map((item) => item.example)
  return `مثال: ${samples.join(' — ')}`
}

export function getSpecialtyExample(title) {
  return specialties.find((item) => item.title === title)?.example || ''
}

export function getSpecialtyFilterPlaceholder() {
  const sample = specialties[1]?.title || specialties[0]?.title || 'اتوماسیون'
  return `مثال: ${sample}`
}

export const specialtySelectOptions = [
  { value: '', label: 'انتخاب کنید' },
  ...specialties.map((item) => ({ value: item.title, label: item.title })),
]

export const specialtyFilterOptions = [
  { value: '', label: 'همه تخصص‌ها' },
  ...specialties.map((item) => ({ value: item.title, label: item.title })),
]
