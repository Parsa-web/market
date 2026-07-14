import { useMemo, useState, useCallback } from 'react'
import SearchBar from '../../components/requests/SearchBar'
import FilterBar from '../../components/requests/FilterBar'
import CategoryChip from '../../components/requests/CategoryChip'
import RequestCard from '../../components/requests/RequestCard'
import RequestModal from '../../components/requests/RequestModal'
import ApplicationModal from '../../components/requests/ApplicationModal'
import EmptyState from '../../components/requests/EmptyState'
import LoadingSkeleton from '../../components/requests/LoadingSkeleton'
import { useSpecialist } from '../../hooks/useSpecialist'
import styles from './OpportunitiesPage.module.css'

const ALL_CATEGORIES = [
  'PLC', 'اتوماسیون', 'برق صنعتی', 'الکترونیک صنعتی',
  'مکانیک', 'هیدرولیک', 'پنوماتیک', 'سرامیک',
  'بسته‌بندی', 'فولاد', 'غذایی', 'نساجی', 'معدن', 'نفت و گاز',
]

const URGENCY_MAP = { 'فوری': 'high', 'بالا': 'high', 'متوسط': 'medium', 'پایین': 'low' }
const STATUS_MAP = {
  'published': 'open',
  'waiting_for_applications': 'open',
  'in_progress': 'in_progress',
  'draft': 'closed',
  'completed': 'closed',
  'cancelled': 'closed',
}

function toRequestCard(req, matchedIds) {
  return {
    id: req.id,
    title: req.title,
    factoryName: req.factoryName || 'کارخانه صنعتی',
    industry: req.industry || '',
    machine: req.machine || '',
    brand: req.brand || '',
    city: req.location || '',
    province: req.location || '',
    requiredSkills: req.skillsRequired || [],
    description: req.description || '',
    budget: req.budget || '',
    deadline: req.applicationDeadline || '',
    urgency: URGENCY_MAP[req.priority] || 'medium',
    status: STATUS_MAP[req.status] || 'closed',
    applicationsCount: 0,
    estimatedDuration: req.requiredTime || '',
    attachments: [],
    createdAt: req.createdAt || '',
    applied: req.applied || false,
    matched: matchedIds.has(req.id),
  }
}

export default function OpportunitiesPage() {
  const { opportunities, applyToOpportunity, loading, matchedRequestIds } = useSpecialist()
  const [filters, setFilters] = useState({
    search: '', industry: '', machine: '', brand: '',
    province: '', city: '', skill: '', urgency: '', status: '',
  })
  const [selectedForDetail, setSelectedForDetail] = useState(null)
  const [selectedForApply, setSelectedForApply] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const mapped = useMemo(() => (opportunities || []).map((r) => toRequestCard(r, matchedRequestIds)), [opportunities, matchedRequestIds])

  const industries = useMemo(() => [...new Set(mapped.map((r) => r.industry))].sort(), [mapped])
  const machines = useMemo(() => [...new Set(mapped.map((r) => r.machine))].sort(), [mapped])
  const brands = useMemo(() => [...new Set(mapped.map((r) => r.brand))].sort(), [mapped])
  const provinces = useMemo(() => [...new Set(mapped.map((r) => r.province))].sort(), [mapped])
  const cities = useMemo(() => {
    const all = filters.province
      ? mapped.filter((r) => r.province === filters.province).map((r) => r.city)
      : mapped.map((r) => r.city)
    return [...new Set(all)].sort()
  }, [mapped, filters.province])
  const skills = useMemo(
    () => [...new Set(mapped.flatMap((r) => r.requiredSkills))].sort(),
    [mapped],
  )

  const filtered = useMemo(() => {
    return mapped.filter((r) => {
      const fullText = [
        r.title, r.factoryName, r.machine, r.brand,
        r.city, r.industry, ...r.requiredSkills,
      ].join(' ').toLowerCase()
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
  }, [mapped, filters])

  const activeCategory = filters.skill

  const handleCategoryClick = useCallback((cat) => {
    setFilters((prev) => ({ ...prev, skill: prev.skill === cat ? '' : cat }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({ search: '', industry: '', machine: '', brand: '', province: '', city: '', skill: '', urgency: '', status: '' })
  }, [])

  const handleSelect = useCallback((id) => {
    const opp = mapped.find((r) => r.id === id)
    if (opp) setSelectedForDetail(opp)
  }, [mapped])

  const handleApplyOpen = useCallback((id) => {
    const opp = mapped.find((r) => r.id === id)
    if (opp) setSelectedForApply(opp)
  }, [mapped])

  const handleApplySubmit = useCallback(async ({ message, startDate, attachments }) => {
    const request = selectedForApply || selectedForDetail
    if (!request) return
    await applyToOpportunity(request.id, message, startDate, '', attachments)
    setSuccessMsg('درخواست همکاری با موفقیت ارسال شد')
    setTimeout(() => setSuccessMsg(''), 3000)
  }, [selectedForApply, selectedForDetail, applyToOpportunity])

  if (loading) {
    return (
      <div className="dash-page">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <SearchBar
        value={filters.search}
        onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
      />

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

      <section className={styles.categories}>
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
      </section>

      {mapped.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <section className={styles.gridSection}>
          <p className={styles.count}>
            <strong>{filtered.length}</strong> نیاز صنعتی پیدا شد
          </p>

          {filtered.length === 0 ? (
            <EmptyState onReset={handleReset} />
          ) : (
            <div className={styles.grid}>
              {filtered.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onSelect={handleSelect}
                  onApply={handleApplyOpen}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <RequestModal
        request={selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
        onApply={(id) => {
          setSelectedForDetail(null)
          const opp = mapped.find((r) => r.id === id)
          if (opp) setSelectedForApply(opp)
        }}
      />

      <ApplicationModal
        request={selectedForApply}
        onClose={() => setSelectedForApply(null)}
        onSubmit={handleApplySubmit}
      />
    </div>
  )
}
