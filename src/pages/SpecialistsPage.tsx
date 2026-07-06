import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Briefcase, MapPin, Award } from 'lucide-react'
import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import SpecialistCard from '../components/specialists/SpecialistCard'
import SearchBar from '../components/specialists/SearchBar'
import FilterBar from '../components/specialists/FilterBar'
import StatisticsCard from '../components/specialists/StatisticsCard'
import CategoryChip from '../components/specialists/CategoryChip'
import ProfileModal from '../components/specialists/ProfileModal'
import EmptyState from '../components/specialists/EmptyState'
import LoadingSkeleton from '../components/specialists/LoadingSkeleton'
import type { Specialist, Filters } from '../components/specialists/types'
import heroImage from '../assets/images/avatar.png'
import styles from './SpecialistsPage.module.css'

const ALL_CATEGORIES = [
  'PLC',
  'برق صنعتی',
  'اتوماسیون',
  'هیدرولیک',
  'پنوماتیک',
  'مکانیک',
  'خط تولید',
  'CNC',
  'کمپرسور',
  'الکترونیک صنعتی',
  'کوره صنعتی',
  'رباتیک',
  'ابزار دقیق',
  'بسته‌بندی',
]

const STATS = [
  { icon: Users, value: 450, suffix: '+', label: 'متخصص فعال' },
  { icon: Briefcase, value: 38, suffix: '', label: 'تخصص صنعتی' },
  { icon: MapPin, value: 64, suffix: '', label: 'شهر' },
  { icon: Award, value: 980, suffix: '+', label: 'پروژه تکمیل شده' },
]

function matchesExperience(years: number, range: string): boolean {
  if (!range) return true
  const map: Record<string, [number, number]> = {
    '1-3': [1, 3],
    '4-7': [4, 7],
    '8-12': [8, 12],
    '13+': [13, 99],
  }
  const [min, max] = map[range] || [0, 99]
  return years >= min && years <= max
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: '', city: '', industry: '', category: '', experience: '', machine: '', brand: '', availability: '',
  })
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    fetch('/data/specialists.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data: Specialist[]) => {
        setSpecialists(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(true)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const selectedSpecialist = useMemo(
    () => specialists.find((s) => s.id === selectedId) || null,
    [specialists, selectedId]
  )

  const cities = useMemo(
    () => [...new Set(specialists.map((s) => s.city))].sort(),
    [specialists]
  )

  const industries = useMemo(
    () => [...new Set(specialists.map((s) => s.industry))].sort(),
    [specialists]
  )

  const filtered = useMemo(() => {
    return specialists.filter((s) => {
      const fullText = `${s.firstName} ${s.lastName} ${s.skills.join(' ')} ${s.machines.join(' ')} ${s.brands.join(' ')} ${s.city} ${s.industry}`.toLowerCase()
      const q = filters.search.toLowerCase()

      if (filters.search && !fullText.includes(q)) return false
      if (filters.city && s.city !== filters.city) return false
      if (filters.industry && s.industry !== filters.industry) return false
      if (filters.category && !s.skills.some((sk) => sk.toLowerCase().includes(filters.category.toLowerCase())) && !s.industry.toLowerCase().includes(filters.category.toLowerCase())) return false
      if (filters.experience && !matchesExperience(s.experienceYears, filters.experience)) return false
      if (filters.availability && s.availability !== filters.availability) return false

      return true
    })
  }, [specialists, filters])

  const activeCategory = filters.category

  const handleCategoryClick = useCallback((cat: string) => {
    setFilters((prev) => ({ ...prev, category: prev.category === cat ? '' : cat }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({ search: '', city: '', industry: '', category: '', experience: '', machine: '', brand: '', availability: '' })
  }, [])

  return (
    <div className={styles.app}>
      <Header />

      {/* Hero */}
      <section className={styles.hero} aria-label="متخصصان صنعتی">
        <div className={styles.heroLayout}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.heroTitle}>متخصصان صنعتی صنعت‌نت</h1>
            <p className={styles.heroSub}>
              متخصصان صنعتی با تجربه در زمینه تعمیر و نگهداری، اتوماسیون، ماشین‌آلات،
              برق صنعتی، خطوط تولید و پشتیبانی فنی.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register?role=specialist" className={styles.btnPrimary}>
                <Users size={18} />
                ثبت‌نام متخصص
              </Link>
              <Link to="/requests" className={styles.btnOutline}>
                <Briefcase size={18} />
                مشاهده درخواست‌های صنعتی
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={heroImage} alt="صنعت‌نت" className={styles.heroImage} />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats} aria-label="آمار پلتفرم">
        <div className={styles.container}>
          <StatisticsCard items={STATS} />
        </div>
      </section>

      {/* Search */}
      <section className={styles.searchSection} aria-label="جستجوی متخصصان">
        <div className={styles.container}>
          <SearchBar
            value={filters.search}
            onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
          />
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        cities={cities}
        industries={industries}
        categories={ALL_CATEGORIES}
      />

      {/* Categories */}
      <section className={styles.categories} aria-label="دسته‌بندی تخصص‌ها">
        <div className={styles.container}>
          <div className={styles.chipScroll}>
            {ALL_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className={styles.gridSection} aria-label="لیست متخصصان">
        <div className={styles.container}>
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className={styles.error}>
              <h3 className={styles.errorTitle}>خطا در بارگذاری</h3>
              <p className={styles.errorDesc}>امکان بارگذاری اطلاعات متخصصان وجود ندارد. لطفاً دوباره تلاش کنید.</p>
              <button type="button" className={styles.retryBtn} onClick={() => window.location.reload()}>
                تلاش مجدد
              </button>
            </div>
          ) : (
            <>
              <p className={styles.count}>
                <strong>{filtered.length}</strong> متخصص پیدا شد
              </p>
              {filtered.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <div className={styles.grid}>
                  {filtered.map((s) => (
                    <SpecialistCard key={s.id} specialist={s} onSelect={setSelectedId} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ProfileModal specialist={selectedSpecialist} onClose={() => setSelectedId(null)} />

      <Footer />
    </div>
  )
}
