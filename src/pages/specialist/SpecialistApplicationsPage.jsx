import { Eye } from 'lucide-react'
import { useRef, useState } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant, APPLICATION_STATUS_LABELS } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'

const FILTERS = ['همه', 'pending', 'accepted', 'rejected']

export default function SpecialistApplicationsPage() {
  const {
    applications,
  } = useSpecialist()
  const [filter, setFilter] = useState('همه')
  const [viewItem, setViewItem] = useState(null)
  const seenPageRef = useRef(false)

  const filterLabels = {
    'همه': 'همه',
    'pending': 'در انتظار',
    'accepted': 'پذیرفته شده',
    'rejected': 'رد شده',
  }

  const appList = applications || []

  const filtered = filter === 'همه'
    ? appList
    : appList.filter((a) => a.status === filter)

  if (appList.length === 0) {
    return (
      <div className="dash-page">
        <EmptyState
          title="درخواستی ارسال نشده"
          description="از بخش نیازهای صنعتی، برای نیازهای صنعتی درخواست همکاری ارسال کنید."
        />
      </div>
    )
  }

  return (
    <div className="dash-page">
      <p className="dash-page-desc">
        {appList.length} درخواست همکاری ارسال شده
      </p>

      <div className="dash-filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`dash-filter-tab${filter === f ? ' dash-filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {filterLabels[f]}
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
              className="dash-application-card"
            >
              <div className="dash-application-card-top">
                <div className="dash-application-factory">
                  <div className="dash-application-factory-name">{app.requestTitle}</div>
                </div>
                <div className="dash-application-card-badges">
                  <Badge variant={getApplicationStatusVariant(app.status)}>
                    {APPLICATION_STATUS_LABELS[app.status] || app.status}
                  </Badge>
                </div>
              </div>

              <h4 className="dash-application-title">{app.requestTitle}</h4>

              {app.message && (
                <p className="dash-application-message">{app.message}</p>
              )}

              <div className="dash-application-footer">
                <span className="dash-application-date">{formatPersianDate(app.createdAt)}</span>
                <Button variant="ghost" className="dash-btn-sm" onClick={() => setViewItem(app)}>
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
                  <h3>{viewItem.requestTitle}</h3>
                </div>
              </div>
              <div className="dash-application-modal-grid">
                <div className="dash-application-modal-item">
                  <span>نیاز صنعتی</span>
                  <strong>{viewItem.requestTitle}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>محل</span>
                  <strong>{viewItem.requestCity || '—'}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>آماده شروع از</span>
                  <strong>{viewItem.availableStartDate || '—'}</strong>
                </div>
              </div>
              {viewItem.message && (
                <div className="dash-application-modal-message">
                  <span>پیام شما</span>
                  <p>{viewItem.message}</p>
                </div>
              )}
              {viewItem.additionalDescription && (
                <div className="dash-application-modal-message">
                  <span>توضیحات تکمیلی</span>
                  <p>{viewItem.additionalDescription}</p>
                </div>
              )}
              <div className="dash-application-modal-status">
                <span>وضعیت درخواست</span>
                <Badge variant={getApplicationStatusVariant(viewItem.status)}>
                  {APPLICATION_STATUS_LABELS[viewItem.status] || viewItem.status}
                </Badge>
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
