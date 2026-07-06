import type { Filters } from './types'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  cities: string[]
  industries: string[]
  categories: string[]
}

const experienceOptions = [
  { value: '', label: 'همه سطوح' },
  { value: '1-3', label: '۱-۳ سال' },
  { value: '4-7', label: '۴-۷ سال' },
  { value: '8-12', label: '۸-۱۲ سال' },
  { value: '13+', label: '۱۳+ سال' },
]

const availabilityOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'available', label: 'فعال' },
  { value: 'busy', label: 'مشغول' },
]

export default function FilterBar({ filters, onChange, cities, industries, categories }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const reset = () => {
    onChange({ search: '', city: '', industry: '', category: '', experience: '', machine: '', brand: '', availability: '' })
  }

  const hasFilters = filters.city || filters.industry || filters.category || filters.experience || filters.availability

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
      <div className={styles.inner}>
        <select
          className={styles.select}
          value={filters.city}
          onChange={(e) => update('city', e.target.value)}
          aria-label="فیلتر شهر"
        >
          <option value="">همه شهرها</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className={styles.select}
          value={filters.industry}
          onChange={(e) => update('industry', e.target.value)}
          aria-label="فیلتر صنعت"
        >
          <option value="">همه صنایع</option>
          {industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>

        <select
          className={styles.select}
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          aria-label="فیلتر تخصص"
        >
          <option value="">همه تخصص‌ها</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className={styles.select}
          value={filters.experience}
          onChange={(e) => update('experience', e.target.value)}
          aria-label="فیلتر سابقه"
        >
          {experienceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          className={styles.select}
          value={filters.availability}
          onChange={(e) => update('availability', e.target.value)}
          aria-label="فیلتر وضعیت"
        >
          {availabilityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button type="button" className={styles.resetBtn} onClick={reset}>
            حذف فیلترها
          </button>
        )}
      </div>
      </div>
    </div>
  )
}
