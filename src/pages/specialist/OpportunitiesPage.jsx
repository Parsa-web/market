import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import OpportunityCard from '../../components/dashboard/OpportunityCard'
import SearchBar from '../../components/dashboard/SearchBar'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function OpportunitiesPage() {
  const { opportunities, applyToOpportunity } = useSpecialist()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [search, setSearch] = useState(initialQuery)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [availableStartDate, setAvailableStartDate] = useState('')
  const [additionalDescription, setAdditionalDescription] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [applying, setApplying] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return opportunities || []
    return (opportunities || []).filter(
      (o) =>
        o.title?.toLowerCase().includes(q) ||
        o.machine?.toLowerCase().includes(q) ||
        o.brand?.toLowerCase().includes(q) ||
        o.industry?.toLowerCase().includes(q)
    )
  }, [opportunities, search])

  const handleApply = async () => {
    if (!selectedOpp) return
    setApplying(true)
    await new Promise((r) => setTimeout(r, 600))
    await applyToOpportunity(selectedOpp.id, applyMessage, availableStartDate, additionalDescription)
    setSelectedOpp(null)
    setApplyMessage('')
    setAvailableStartDate('')
    setAdditionalDescription('')
    setApplying(false)
    setSuccessMsg('درخواست همکاری با موفقیت ارسال شد')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <p className="dash-page-desc">نیازهای صنعتی ثبت‌شده توسط کارخانه‌ها را مشاهده کنید و درخواست همکاری ارسال کنید.</p>

      <SearchBar value={search} onChange={setSearch} placeholder="جستجو در نیازهای صنعتی..." />

      {filtered.length === 0 ? (
        <EmptyState
          title="نیاز صنعتی‌ای یافت نشد"
          description="در حال حاضر نیاز صنعتی متناسب با جستجوی شما وجود ندارد."
        />
      ) : (
        <div className="dash-opportunities-list">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onView={() => setSelectedOpp(opp)}
              onApply={() => setSelectedOpp(opp)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!selectedOpp}
        onClose={() => { setSelectedOpp(null); setApplyMessage(''); setAvailableStartDate(''); setAdditionalDescription('') }}
        title="ارسال درخواست همکاری"
      >
        {selectedOpp && (
          <>
            <p className="dash-modal-text">
              درخواست همکاری برای <strong>{selectedOpp.title}</strong>
            </p>

            {!selectedOpp.applied && (
              <div className="dash-form" style={{ marginTop: '16px' }}>
                <div className="auth-field rg-full">
                  <label className="auth-field-label">پیام به کارخانه</label>
                  <textarea
                    className="dash-textarea"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="تجربیات و مهارت‌های مرتبط خود را توضیح دهید..."
                    rows={3}
                  />
                </div>
                <div className="auth-field rg-full">
                  <label className="auth-field-label">زمان شروع</label>
                  <input
                    className="dash-filter-input"
                    type="text"
                    value={availableStartDate}
                    onChange={(e) => setAvailableStartDate(e.target.value)}
                    placeholder="از چه زمانی می‌توانید شروع کنید؟"
                  />
                </div>
                <div className="auth-field rg-full">
                  <label className="auth-field-label">توضیحات تکمیلی</label>
                  <textarea
                    className="dash-textarea"
                    value={additionalDescription}
                    onChange={(e) => setAdditionalDescription(e.target.value)}
                    placeholder="توضیحات اضافی در مورد توانمندی‌ها یا شرایط..."
                    rows={2}
                  />
                </div>
              </div>
            )}

            <div className="dash-modal-actions">
              <Button variant="outline" onClick={() => { setSelectedOpp(null); setApplyMessage(''); setAvailableStartDate(''); setAdditionalDescription('') }}>انصراف</Button>
              {!selectedOpp.applied ? (
                <Button variant="primary" onClick={handleApply} loading={applying} loadingText="در حال ارسال...">
                  ارسال درخواست همکاری
                </Button>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>درخواست قبلاً ارسال شده</span>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
