import { Eye } from 'lucide-react'
import { useRef, useState } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant } from '../../utils/dashboardUtils'
import { useAuth } from '../../hooks/useAuth'
import { useSpecialist } from '../../hooks/useSpecialist'

const FILTERS = ['همه', 'در انتظار', 'پذیرفته شده', 'رد شده']

export default function SpecialistApplicationsPage() {
  const { user } = useAuth()
  const {
    applications,
    refresh,
    markApplicationSeen,
  } = useSpecialist()
  const [filter, setFilter] = useState('همه')
  const [viewItem, setViewItem] = useState(null)
  const seenPageRef = useRef(false)

  if (!seenPageRef.current) {
    seenPageRef.current = true
    refresh()
  }

  const isAppNew = (app) => {
    if (app.status === 'در انتظار') return false
    if (!app.updatedAt) return false
    const seenAt = app.seenAt || 0
    return app.updatedAt > seenAt
  }

  const handleViewDetails = (app) => {
    setViewItem(app)
    if (isAppNew(app)) {
      markApplicationSeen(app.id)
    }
  }

  const filtered = filter === 'همه'
    ? applications
    : applications.filter((a) => a.status === filter)

  if (applications.length === 0) {
    return (
      <div className="dash-page">
        <EmptyState
          title="درخواستی ارسال نشده"
          description="از بخش درخواست‌های صنعتی، درخواست همکاری ارسال کنید."
        />
      </div>
    )
  }

  return (
    <div className="dash-page">
      <p className="dash-page-desc">
        {applications.length} درخواست همکاری ارسال شده
      </p>

      <div className="dash-filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`dash-filter-tab${filter === f ? ' dash-filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="درخواستی یافت نشد"
          description="در این وضعیت درخواستی وجود ندارد."
        />
      ) : (
        <div className="dash-applications-list">
          {filtered.map((app) => (
            <article
              key={app.id}
              className={`dash-application-card${isAppNew(app) ? ' dash-application-card--new' : ''}`}
            >
              <div className="dash-application-card-top">
                <div className="dash-application-factory">
                  <div className="dash-application-factory-name">{app.factoryName}</div>
                </div>
                <div className="dash-application-card-badges">
                  {isAppNew(app) && (
                    <span className="dash-application-new-badge">جدید</span>
                  )}
                  <Badge variant={getApplicationStatusVariant(app.status)}>{app.status}</Badge>
                </div>
              </div>

              <h4 className="dash-application-title">{app.requestTitle}</h4>

              {app.message && (
                <p className="dash-application-message">{app.message}</p>
              )}

              <div className="dash-application-footer">
                <span className="dash-application-date">{formatPersianDate(app.createdAt)}</span>
                <Button variant="ghost" className="dash-btn-sm" onClick={() => handleViewDetails(app)}>
                  <Eye size={14} />
                  جزئیات
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="جزئیات درخواست ارسال‌شده">
        {viewItem && (
          <>
            <div className="dash-application-modal">
              <div className="dash-application-modal-head">
                <div>
                  <h3>{viewItem.factoryName}</h3>
                  <p>{viewItem.requestTitle}</p>
                </div>
              </div>
              <div className="dash-application-modal-grid">
                <div className="dash-application-modal-item">
                  <span>کارخانه</span>
                  <strong>{viewItem.factoryName}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>درخواست</span>
                  <strong>{viewItem.requestTitle}</strong>
                </div>
              </div>
              {viewItem.message && (
                <div className="dash-application-modal-message">
                  <span>پیام شما</span>
                  <p>{viewItem.message}</p>
                </div>
              )}
              <div className="dash-application-modal-status">
                <span>وضعیت درخواست</span>
                <Badge variant={getApplicationStatusVariant(viewItem.status)}>{viewItem.status}</Badge>
              </div>
            </div>
            <div className="dash-modal-actions">
              <Button variant="ghost" onClick={() => setViewItem(null)}>بستن</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
