import { Eye, MessageSquare, Send, UserCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import OpportunityCard from '../../components/dashboard/OpportunityCard'
import ProgressCard from '../../components/dashboard/ProgressCard'
import StatCard from '../../components/dashboard/StatCard'
import Modal from '../../components/dashboard/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useSpecialist } from '../../hooks/useSpecialist'
import { formatBadgeCount } from '../../utils/dashboardUtils'
import { useState } from 'react'

export default function SpecialistDashboardPage() {
  const { user } = useAuth()
  const { stats, profileData, recommended, applyToOpportunity } = useSpecialist()
  const navigate = useNavigate()
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [applying, setApplying] = useState(false)

  const handleApply = async (opp) => {
    setApplying(true)
    await new Promise((r) => setTimeout(r, 600))
    applyToOpportunity(opp.id, applyMessage)
    setSelectedOpp(null)
    setApplyMessage('')
    setApplying(false)
    setSuccessMsg('درخواست همکاری با موفقیت ارسال شد')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <section className="dash-welcome">
        <div className="dash-welcome-content">
          <h2 className="dash-welcome-title">سلام، {user?.fullName || 'متخصص'}</h2>
          <p className="dash-welcome-subtitle">
            درخواست‌های صنعتی متناسب با مهارت‌های خود را پیدا کنید و درخواست همکاری ارسال کنید.
          </p>
          <div className="dash-welcome-actions">
            <Button variant="primary" onClick={() => navigate('/specialist/opportunities')}>
              مشاهده درخواست‌های صنعتی
            </Button>
            <Button variant="outline" onClick={() => navigate('/specialist/profile')}>
              تکمیل پروفایل
            </Button>
          </div>
        </div>
      </section>

      <section className="dash-stats-grid">
        <StatCard
          icon={Send}
          label="درخواست‌های ارسالی"
          value={formatBadgeCount(stats.totalApplications)}
          description="تعداد درخواست‌های ارسال شده"
          to="/specialist/applications"
        />
        <StatCard
          icon={MessageSquare}
          label="پیام‌های جدید"
          value={formatBadgeCount(stats.unreadMessages)}
          description="پیام‌های خوانده نشده"
          to="/specialist/messages"
        />
        <StatCard
          icon={Eye}
          label="بازدید پروفایل"
          value={formatBadgeCount(stats.profileViews)}
          description="تعداد بازدید پروفایل"
          to="/specialist/profile"
        />
        <StatCard
          icon={UserCheck}
          label="درصد تکمیل پروفایل"
          value={`${stats.profileCompletion}٪`}
          description="وضعیت پروفایل تخصصی"
          to="/specialist/profile"
        />
      </section>

      <section className="dash-section">
        <ProgressCard
          percentage={stats.profileCompletion}
          missingItems={profileData.missingItems}
          onComplete={() => navigate('/specialist/profile')}
        />
      </section>

      <section className="dash-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">درخواست‌های صنعتی پیشنهادی</h2>
          <Link to="/specialist/opportunities" className="dash-section-link">
            مشاهده همه
          </Link>
        </div>
        <div className="dash-opportunities-list">
          {recommended.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              compact
              onView={() => setSelectedOpp(opp)}
              onApply={() => setSelectedOpp(opp)}
            />
          ))}
        </div>
      </section>

      <Modal
        open={!!selectedOpp}
        onClose={() => { setSelectedOpp(null); setApplyMessage('') }}
        title="ارسال درخواست همکاری"
      >
        {selectedOpp && (
          <>
            <p className="dash-modal-text">
              آیا مایلید درخواست همکاری برای <strong>{selectedOpp.title}</strong> در {selectedOpp.factoryName} ارسال شود؟
            </p>

            {!selectedOpp.applied && (
              <div className="dash-form" style={{ marginTop: '16px' }}>
                <div className="auth-field rg-full">
                  <label className="auth-field-label">پیام به کارخانه (اختیاری)</label>
                  <textarea
                    className="dash-textarea"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="تجربیات و مهارت‌های مرتبط خود را بنویسید..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="dash-modal-actions">
              <Button variant="outline" onClick={() => { setSelectedOpp(null); setApplyMessage('') }}>انصراف</Button>
              {!selectedOpp.applied ? (
                <Button variant="primary" onClick={() => handleApply(selectedOpp)} loading={applying} loadingText="در حال ارسال...">
                  ارسال درخواست
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
