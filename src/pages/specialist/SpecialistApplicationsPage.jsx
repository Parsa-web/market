import { Building2, Calendar, Clock, Eye, MessageSquare, ChevronLeft, Tag, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant, APPLICATION_STATUS_LABELS, formatBudget } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'

const FILTERS = ['همه', 'pending', 'accepted', 'rejected']

const filterLabels = {
  'همه': 'همه',
  'pending': 'در انتظار',
  'accepted': 'پذیرفته شده',
  'rejected': 'رد شده',
}

function ApplicationCard({ app, onView, onChat, requestDetails }) {
  const statusVariant = getApplicationStatusVariant(app.status)
  const statusLabel = APPLICATION_STATUS_LABELS[app.status] || app.status

  return (
    <article className="dash-app-card">
      <div className="dash-app-card-header">
        <div className="dash-app-card-icon">
          <Building2 size={16} />
        </div>
        <div className="dash-app-card-info">
          <div className="dash-app-card-title">{app.requestTitle || 'نیاز صنعتی'}</div>
          {app.factoryName && <div className="dash-app-card-sub">{app.factoryName}</div>}
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {app.message && (
        <div className="dash-app-card-message">{app.message}</div>
      )}

      <div className="dash-app-card-meta">
        {requestDetails?.budget && (
          <span className="dash-app-card-meta-item">
            <Wallet size={11} />
            {formatBudget(requestDetails.budget)}
          </span>
        )}
        {app.availableStartDate && (
          <span className="dash-app-card-meta-item">
            <Calendar size={11} />
            شروع: {app.availableStartDate}
          </span>
        )}
        <span className="dash-app-card-meta-item">
          <Clock size={11} />
          {formatPersianDate(app.createdAt)}
        </span>
      </div>

      <div className="dash-app-card-actions">
        <div />
        <div className="dash-app-card-btns">
          {app.status === 'accepted' && onChat && (
            <Button variant="primary" className="dash-btn-sm" onClick={() => onChat(app)}>
              <MessageSquare size={13} />
              چت
            </Button>
          )}
          <Button variant="ghost" className="dash-btn-sm" onClick={() => onView(app)}>
            <Eye size={13} />
            جزئیات
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function SpecialistApplicationsPage() {
  const { applications, opportunities, conversations } = useSpecialist()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('همه')
  const [viewItem, setViewItem] = useState(null)

  const appList = applications || []

  const filtered = filter === 'همه'
    ? appList
    : appList.filter((a) => a.status === filter)

  const getAppConversationId = (app) => {
    const conv = (conversations || []).find(c =>
      String(c.factoryId) === String(app.factoryId) &&
      String(c.specialistId) === String(app.specialistId)
    )
    return conv?.id
  }

  const handleOpenChat = (app) => {
    const convId = getAppConversationId(app)
    if (convId) navigate(`/specialist/messages?conversation=${convId}`)
  }

  const getRequestDetails = (app) => {
    if (!opportunities) return null
    return opportunities.find((o) => o.id === app.requestId)
  }

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
        <strong>{appList.length}</strong> درخواست همکاری ارسال شده
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
        <div className="dash-app-card-grid">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              requestDetails={getRequestDetails(app)}
              onView={setViewItem}
              onChat={handleOpenChat}
            />
          ))}
        </div>
      )}

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="جزئیات درخواست ارسال‌شده">
        {viewItem && (() => {
          const req = getRequestDetails(viewItem)
          return (
            <>
              <div className="dash-application-modal">
                <div className="dash-application-modal-head">
                  <div>
                    <h3>{viewItem.requestTitle}</h3>
                    {viewItem.factoryName && <p>{viewItem.factoryName}</p>}
                  </div>
                </div>
                <div className="dash-application-modal-grid">
                  <div className="dash-application-modal-item">
                    <span>نیاز صنعتی</span>
                    <strong>{viewItem.requestTitle}</strong>
                  </div>
                  {req?.industry && (
                    <div className="dash-application-modal-item">
                      <span>صنعت</span>
                      <strong>{req.industry}</strong>
                    </div>
                  )}
                  {req?.budget && (
                    <div className="dash-application-modal-item">
                      <span>بودجه</span>
                      <strong>{formatBudget(req.budget)}</strong>
                    </div>
                  )}
                  <div className="dash-application-modal-item">
                    <span>آماده شروع از</span>
                    <strong>{viewItem.availableStartDate || '—'}</strong>
                  </div>
                  <div className="dash-application-modal-item">
                    <span>تاریخ ارسال</span>
                    <strong>{formatPersianDate(viewItem.createdAt)}</strong>
                  </div>
                  <div className="dash-application-modal-item">
                    <span>وضعیت</span>
                    <strong>
                      <Badge variant={getApplicationStatusVariant(viewItem.status)}>
                        {APPLICATION_STATUS_LABELS[viewItem.status] || viewItem.status}
                      </Badge>
                    </strong>
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
              </div>
              <div className="dash-modal-actions">
                {getAppConversationId(viewItem) && (
                  <Button variant="primary" onClick={() => handleOpenChat(viewItem)}>
                    <MessageSquare size={16} />
                    ورود به چت
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setViewItem(null)}>بستن</Button>
              </div>
            </>
          )
        })()}
      </Modal>
    </div>
  )
}