import { ClipboardList, MessageSquare, Users, Building2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import ProgressCard from '../../components/dashboard/ProgressCard'
import RequestCard from '../../components/dashboard/RequestCard'
import StatCard from '../../components/dashboard/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { useFactory } from '../../hooks/useFactory'
import { formatBadgeCount, STATUS_LABELS } from '../../utils/dashboardUtils'

export default function FactoryDashboardPage() {
  const { user } = useAuth()
  const { stats, requests, profileCompletion, missingItems, loading } = useFactory()
  const navigate = useNavigate()

  if (loading) {
    return <div className="dash-page"><div className="dash-loading">در حال بارگذاری...</div></div>
  }

  const recentRequests = (requests || [])
    .filter((r) => r.status === 'published' || r.status === 'waiting_for_applications' || r.status === 'in_progress')
    .slice(0, 3)

  return (
    <div className="dash-page">
      <section className="dash-welcome">
        <div className="dash-welcome-content">
          <h2 className="dash-welcome-title">سلام، {user?.company || 'کارخانه'}</h2>
          <p className="dash-welcome-subtitle">
            نیازهای فنی کارخانه خود را مدیریت کنید و درخواست‌های متخصصان را بررسی کنید.
          </p>
          <div className="dash-welcome-actions">
            <Button variant="primary" onClick={() => navigate('/factory/requests/new')}>
              ثبت نیاز جدید
            </Button>
          </div>
        </div>
      </section>

      <section className="dash-stats-grid">
        <StatCard
          icon={ClipboardList}
          label="نیازهای فعال"
          value={formatBadgeCount(stats?.activeRequests || 0)}
          description="تعداد درخواست‌های باز کارخانه"
          to="/factory/requests"
        />
        <StatCard
          icon={Users}
          label="درخواست‌های دریافتی"
          value={formatBadgeCount(stats?.pendingApplications || 0)}
          description="درخواست‌های در انتظار بررسی"
          to="/factory/applications"
        />
        <StatCard
          icon={MessageSquare}
          label="پیام‌های جدید"
          value={formatBadgeCount(stats?.unreadMessages || 0)}
          description="پیام‌های خوانده نشده"
          to="/factory/messages"
        />
        <StatCard
          icon={Building2}
          label="درصد تکمیل پروفایل"
          value={`${profileCompletion || 0}٪`}
          description="وضعیت پروفایل کارخانه"
          to="/factory/profile"
        />
      </section>

      <section className="dash-section">
        <ProgressCard
          percentage={profileCompletion || 0}
          missingItems={missingItems || []}
          onComplete={() => navigate('/factory/profile')}
        />
      </section>

      <section className="dash-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">آخرین درخواست‌ها</h2>
          <Link to="/factory/requests" className="dash-section-link">مشاهده همه</Link>
        </div>
        <div className="dash-requests-list">
          {recentRequests.length === 0 && (
            <p className="dash-empty-text">هنوز درخواستی ثبت نکرده‌اید.</p>
          )}
          {recentRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              compact
              onView={() => navigate('/factory/requests')}
              onEdit={() => navigate('/factory/requests')}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
