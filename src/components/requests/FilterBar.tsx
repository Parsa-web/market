import type { RequestFilters } from './types'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filters: RequestFilters
  onChange: (filters: RequestFilters) => void
  industries: string[]
  machines: string[]
  brands: string[]
  provinces: string[]
  cities: string[]
  skills: string[]
}

const urgencyOptions = [
  { value: '', label: 'همه اولویت‌ها' },
  { value: 'high', label: 'فوری' },
  { value: 'medium', label: 'متوسط' },
  { value: 'low', label: 'عادی' },
]

const statusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال انجام' },
  { value: 'closed', label: 'بسته شده' },
]

export default function FilterBar({ filters, onChange, industries, machines, brands, provinces, cities, skills }: FilterBarProps) {
  const update = (key: keyof RequestFilters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const reset = () => {
    onChange({ search: '', industry: '', machine: '', brand: '', province: '', city: '', skill: '', urgency: '', status: '' })
  }

  const hasFilters = filters.industry || filters.machine || filters.brand || filters.province || filters.city || filters.skill || filters.urgency || filters.status

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.inner}>
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
            value={filters.machine}
            onChange={(e) => update('machine', e.target.value)}
            aria-label="فیلتر دستگاه"
          >
            <option value="">همه دستگاه‌ها</option>
            {machines.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            className={styles.select}
            value={filters.brand}
            onChange={(e) => update('brand', e.target.value)}
            aria-label="فیلتر برند"
          >
            <option value="">همه برندها</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select
            className={styles.select}
            value={filters.province}
            onChange={(e) => { update('province', e.target.value); update('city', '') }}
            aria-label="فیلتر استان"
          >
            <option value="">همه استان‌ها</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

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
            value={filters.skill}
            onChange={(e) => update('skill', e.target.value)}
            aria-label="فیلتر مهارت"
          >
            <option value="">همه مهارت‌ها</option>
            {skills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className={styles.select}
            value={filters.urgency}
            onChange={(e) => update('urgency', e.target.value)}
            aria-label="فیلتر اولویت"
          >
            {urgencyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            className={styles.select}
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            aria-label="فیلتر وضعیت"
          >
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
