import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Briefcase, Award, FileText } from 'lucide-react'
import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import SearchBar from '../components/requests/SearchBar'
import FilterBar from '../components/requests/FilterBar'
import StatisticsCard from '../components/requests/StatisticsCard'
import CategoryChip from '../components/requests/CategoryChip'
import RequestCard from '../components/requests/RequestCard'
import RequestModal from '../components/requests/RequestModal'
import ApplicationModal from '../components/requests/ApplicationModal'
import EmptyState from '../components/requests/EmptyState'
import LoadingSkeleton from '../components/requests/LoadingSkeleton'
import type { IndustrialRequest, RequestFilters } from '../components/requests/types'
import heroImage from '../assets/images/darkhast.png'
import styles from './IndustrialRequestsPage.module.css'

const ALL_CATEGORIES = [
  'PLC',
  'اتوماسیون',
  'برق صنعتی',
  'الکترونیک صنعتی',
  'مکانیک',
  'هیدرولیک',
  'پنوماتیک',
  'سرامیک',
  'بسته‌بندی',
  'فولاد',
  'غذایی',
  'نساجی',
  'معدن',
  'نفت و گاز',
]

const STATS = [
  { icon: FileText, value: 980, suffix: '+', label: 'پروژه تکمیل شده' },
  { icon: Briefcase, value: 320, suffix: '+', label: 'کارخانه فعال' },
  { icon: Users, value: 450, suffix: '+', label: 'متخصص مجرب' },
  { icon: Award, value: 38, suffix: '', label: 'صنعت تحت پوشش' },
]

export default function RequestsPage() {
  const [requests, setRequests] = useState<IndustrialRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState<RequestFilters>({
    search: '', industry: '', machine: '', brand: '', province: '', city: '', skill: '', urgency: '', status: '',
  })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [applyId, setApplyId] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/data/industrialRequests.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data: IndustrialRequest[]) => {
        setRequests(data)
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

  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedId) || null,
    [requests, selectedId]
  )

  const applyRequest = useMemo(
    () => requests.find((r) => r.id === applyId) || null,
    [requests, applyId]
  )

  const industries = useMemo(
    () => [...new Set(requests.map((r) => r.industry))].sort(),
    [requests]
  )

  const machines = useMemo(
    () => [...new Set(requests.map((r) => r.machine))].sort(),
    [requests]
  )

  const brands = useMemo(
    () => [...new Set(requests.map((r) => r.brand))].sort(),
    [requests]
  )

  const provinces = useMemo(
    () => [...new Set(requests.map((r) => r.province))].sort(),
    [requests]
  )

  const cities = useMemo(() => {
    const all = filters.province
      ? requests.filter((r) => r.province === filters.province).map((r) => r.city)
      : requests.map((r) => r.city)
    return [...new Set(all)].sort()
  }, [requests, filters.province])

  const skills = useMemo(
    () => [...new Set(requests.flatMap((r) => r.requiredSkills))].sort(),
    [requests]
  )

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const fullText = `${r.title} ${r.factoryName} ${r.machine} ${r.brand} ${r.city} ${r.industry} ${r.requiredSkills.join(' ')}`.toLowerCase()
      const q = filters.search.toLowerCase()

      if (filters.search && !fullText.includes(q)) return false
      if (filters.industry && r.industry !== filters.industry) return false
      if (filters.machine && r.machine !== filters.machine) return false
      if (filters.brand && r.brand !== filters.brand) return false
      if (filters.province && r.province !== filters.province) return false
      if (filters.city && r.city !== filters.city) return false
      if (filters.skill && !r.requiredSkills.some((s) => s.toLowerCase().includes(filters.skill.toLowerCase()))) return false
      if (filters.urgency && r.urgency !== filters.urgency) return false
      if (filters.status && r.status !== filters.status) return false

      return true
    })
  }, [requests, filters])

  const activeCategory = filters.skill

  const handleCategoryClick = useCallback((cat: string) => {
    setFilters((prev) => ({ ...prev, skill: prev.skill === cat ? '' : cat }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({ search: '', industry: '', machine: '', brand: '', province: '', city: '', skill: '', urgency: '', status: '' })
  }, [])

  const handleApply = useCallback((id: number) => {
    setSelectedId(null)
    setApplyId(id)
  }, [])

  return (
    <div className={styles.app}>
      <Header />

      {/* Hero */}
      <section className={styles.hero} aria-label="درخواست‌های صنعتی">
        <div className={styles.heroLayout}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.heroTitle}>درخواست‌های صنعتی</h1>
            <p className={styles.heroSub}>
              درخواست‌های واقعی تعمیر و نگهداری صنعتی منتشر شده توسط کارخانه‌ها در صنایع مختلف را مرور کنید.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register?role=specialist" className={styles.btnPrimary}>
                <Users size={18} />
                ثبت‌نام متخصص
              </Link>
              <Link to="/register?role=factory" className={styles.btnOutline}>
                <FileText size={18} />
                ثبت درخواست صنعتی
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
      <section className={styles.searchSection} aria-label="جستجوی درخواست‌ها">
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
        industries={industries}
        machines={machines}
        brands={brands}
        provinces={provinces}
        cities={cities}
        skills={skills}
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
      <section className={styles.gridSection} aria-label="لیست درخواست‌ها">
        <div className={styles.container}>
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className={styles.error}>
              <h3 className={styles.errorTitle}>خطا در بارگذاری</h3>
              <p className={styles.errorDesc}>امکان بارگذاری اطلاعات درخواست‌ها وجود ندارد. لطفاً دوباره تلاش کنید.</p>
              <button type="button" className={styles.retryBtn} onClick={() => window.location.reload()}>
                تلاش مجدد
              </button>
            </div>
          ) : (
            <>
              <p className={styles.count}>
                <strong>{filtered.length}</strong> درخواست صنعتی پیدا شد
              </p>
              {filtered.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <div className={styles.grid}>
                  {filtered.map((r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                      onSelect={setSelectedId}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <RequestModal
        request={selectedRequest}
        onClose={() => setSelectedId(null)}
        onApply={handleApply}
      />

      <ApplicationModal
        request={applyRequest}
        onClose={() => setApplyId(null)}
      />

      <Footer />
    </div>
  )
}
