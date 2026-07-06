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
  const [successMsg, setSuccessMsg] = useState('')
  const [applying, setApplying] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return opportunities
    return opportunities.filter(
      (o) =>
        o.title?.toLowerCase().includes(q) ||
        o.factoryName?.toLowerCase().includes(q) ||
        o.equipment?.toLowerCase().includes(q) ||
        o.brand?.toLowerCase().includes(q) ||
        o.specialty?.toLowerCase().includes(q)
    )
  }, [opportunities, search])

  const handleApply = async () => {
    if (!selectedOpp) return
    setApplying(true)
    await new Promise((r) => setTimeout(r, 600))
    applyToOpportunity(selectedOpp.id, applyMessage)
    setSelectedOpp(null)
    setApplyMessage('')
    setApplying(false)
    setSuccessMsg('درخواست همکاری با موفقیت ارسال شد')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <p className="dash-page-desc">درخواست‌های صنعتی کارخانه‌ها بر اساس مهارت‌ها و تجربه شما</p>

      <div className="dash-page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="جستجو در درخواست‌های صنعتی..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="درخواستی یافت نشد" description="با تکمیل پروفایل، درخواست‌های صنعتی بیشتری پیشنهاد می‌شود." />
      ) : (
        <div className="dash-opportunities-list">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onView={setSelectedOpp}
              onApply={setSelectedOpp}
            />
          ))}
        </div>
      )}

      <Modal open={!!selectedOpp} onClose={() => { setSelectedOpp(null); setApplyMessage('') }} title="ارسال درخواست همکاری">
        {selectedOpp && (
          <>
            <div className="dash-modal-details">
              <p><strong>کارخانه:</strong> {selectedOpp.factoryName}</p>
              <p><strong>صنعت:</strong> {selectedOpp.industry}</p>
              <p><strong>عنوان:</strong> {selectedOpp.title}</p>
              <p><strong>تخصص:</strong> {selectedOpp.specialty}</p>
              <p><strong>دستگاه:</strong> {selectedOpp.equipment}</p>
              <p><strong>برند:</strong> {selectedOpp.brand}</p>
              <p><strong>شهر:</strong> {selectedOpp.city}</p>
            </div>

            {!selectedOpp.applied && (
              <div className="dash-form" style={{ marginTop: '16px' }}>
                <div className="auth-field rg-full">
                  <label className="auth-field-label">پیام به کارخانه (اختیاری)</label>
                  <textarea
                    className="dash-textarea"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="تجربیات و مهارت‌های مرتبط خود را بنویسید..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <div className="dash-modal-actions">
              <Button variant="outline" onClick={() => { setSelectedOpp(null); setApplyMessage('') }}>انصراف</Button>
              {!selectedOpp.applied ? (
                <Button variant="primary" onClick={handleApply} loading={applying} loadingText="در حال ارسال...">
                  ارسال درخواست همکاری
                </Button>
              ) : (
                <span className="dash-badge dash-badge--completed">درخواست ارسال شده</span>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
