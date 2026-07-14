import { Eye, MessageSquare, Send, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import ProgressCard from '../../components/dashboard/ProgressCard'
import StatCard from '../../components/dashboard/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { useSpecialist } from '../../hooks/useSpecialist'
import { formatBadgeCount } from '../../utils/dashboardUtils'

export default function SpecialistDashboardPage() {
  const { user } = useAuth()
  const { stats, profileData, loading } = useSpecialist()
  const navigate = useNavigate()

  if (loading) {
    return <div className="dash-page"><div className="dash-loading">در حال بارگذاری...</div></div>
  }

  return (
    <div className="dash-page">
      <section className="dash-welcome">
        <div className="dash-welcome-content">
          <h2 className="dash-welcome-title">سلام، {user?.fullName || 'متخصص'}</h2>
          <p className="dash-welcome-subtitle">
            نیازهای صنعتی متناسب با مهارت‌های خود را پیدا کنید و درخواست همکاری ارسال کنید.
          </p>
          <div className="dash-welcome-actions">
            <Button variant="primary" onClick={() => navigate('/specialist/opportunities')}>
              مشاهده نیازهای صنعتی
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
          value={formatBadgeCount(stats?.totalApplications || 0)}
          description="تعداد درخواست‌های ارسال شده"
          to="/specialist/applications"
        />
        <StatCard
          icon={MessageSquare}
          label="پیام‌های جدید"
          value={formatBadgeCount(stats?.unreadMessages || 0)}
          description="پیام‌های خوانده نشده"
          to="/specialist/messages"
        />
        <StatCard
          icon={Eye}
          label="بازدید پروفایل"
          value={formatBadgeCount(stats?.profileViews || 0)}
          description="تعداد بازدید پروفایل"
          to="/specialist/profile"
        />
        <StatCard
          icon={UserCheck}
          label="درصد تکمیل پروفایل"
          value={`${profileData?.profileCompletion || 0}٪`}
          description="وضعیت پروفایل تخصصی"
          to="/specialist/profile"
        />
      </section>

      <section className="dash-section">
        <ProgressCard
          percentage={profileData?.profileCompletion || 0}
          missingItems={profileData?.missingItems || []}
          onComplete={() => navigate('/specialist/profile')}
        />
      </section>

    </div>
  )
}
