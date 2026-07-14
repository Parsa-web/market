import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Eye, MessageSquare, X } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant, APPLICATION_STATUS_LABELS } from '../../utils/dashboardUtils'
import { useFactory } from '../../hooks/useFactory'

const FILTERS = ['all', 'pending', 'accepted', 'rejected']

export default function FactoryApplicationsPage() {
  const { applications, conversations, markApplicationsSeen, acceptApplication, rejectApplication } = useFactory()
  const navigate = useNavigate()
  const [viewItem, setViewItem] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  useEffect(() => {
    if (markApplicationsSeen) markApplicationsSeen()
  }, [markApplicationsSeen])

  const handleAccept = async (app) => {
    try {
      await acceptApplication(app.id)
      showSuccess('درخواست متخصص پذیرفته شد')
      setViewItem(null)
    } catch {
      showSuccess('خطا در پذیرش درخواست')
    }
  }

  const handleReject = async (app) => {
    try {
      await rejectApplication(app.id)
      showSuccess('درخواست متخصص رد شد')
      setViewItem(null)
    } catch {
      showSuccess('خطا در رد درخواست')
    }
  }

  const getAppConversationId = (app) => {
    const conv = (conversations || []).find(c =>
      String(c.factoryId) === String(app.factoryId) &&
      String(c.specialistId) === String(app.specialistId)
    )
    return conv?.id
  }

  const appList = (applications || []).filter(
    (a) => activeFilter === 'all' || a.status === activeFilter
  )

  if ((applications || []).length === 0) {
    return (
      <div className="dash-page">
        <EmptyState
          title="درخواستی دریافت نشده"
          description="وقتی متخصصان برای نیازهای صنعتی شما اعلام آمادگی کنند، اینجا نمایش داده می‌شود."
        />
      </div>
    )
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <div className="dash-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`dash-tab ${activeFilter === f ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? 'همه' : APPLICATION_STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      <div className="dash-app-card-grid">
        {appList.map((app) => (
          <div key={app.id} className="dash-app-card">
            <div className="dash-app-card-header">
              <div className="dash-app-card-icon">
                {app.specialistName?.charAt(0) || 'M'}
              </div>
              <div className="dash-app-card-info">
                <span className="dash-app-card-title">{app.specialistName || `متخصص #${app.specialistId}`}</span>
                <span className="dash-app-card-sub">{app.requestTitle}</span>
              </div>
              <Badge variant={getApplicationStatusVariant(app.status)}>
                {APPLICATION_STATUS_LABELS[app.status] || app.status}
              </Badge>
            </div>
            {app.message && <p className="dash-app-card-message">{app.message}</p>}
            <div className="dash-app-card-meta">
              <span className="dash-app-card-meta-item">{formatPersianDate(app.createdAt)}</span>
            </div>
            <div className="dash-app-card-actions">
              <div className="dash-app-card-btns">
                <Button variant="ghost" className="dash-btn-sm" onClick={() => setViewItem(app)}>
                  <Eye size={13} /> جزئیات
                </Button>
                {app.status === 'pending' && (
                  <>
                    <Button variant="primary" className="dash-btn-sm" onClick={() => handleAccept(app)}>
                      <Check size={13} /> پذیرش
                    </Button>
                    <Button variant="outline" className="dash-btn-sm" onClick={() => handleReject(app)}>
                      <X size={13} /> رد
                    </Button>
                  </>
                )}
                {app.status === 'accepted' && getAppConversationId(app) && (
                  <Button variant="primary" className="dash-btn-sm" onClick={() => navigate(`/factory/messages?conversation=${getAppConversationId(app)}`)}>
                    <MessageSquare size={13} /> پیام
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="جزئیات درخواست همکاری">
        {viewItem && (
          <>
            <div className="dash-application-modal">
              <div className="dash-application-modal-head">
                <div>
                  <h3>{viewItem.specialistName || `متخصص #${viewItem.specialistId}`}</h3>
                  <p>{viewItem.requestTitle}</p>
                </div>
              </div>
              <div className="dash-application-modal-grid">
                <div className="dash-application-modal-item">
                  <span>نیاز صنعتی</span>
                  <strong>{viewItem.requestTitle}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>تخصص</span>
                  <strong>{viewItem.requestSpecialty || '—'}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>دستگاه</span>
                  <strong>{viewItem.requestEquipment || '—'}</strong>
                </div>
                <div className="dash-application-modal-item">
                  <span>برند</span>
                  <strong>{viewItem.requestBrand || '—'}</strong>
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
                  <span>پیام متخصص</span>
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
              {viewItem.status === 'pending' && (
                <>
                  <Button variant="primary" onClick={() => handleAccept(viewItem)}>پذیرش متخصص</Button>
                  <Button variant="outline" onClick={() => handleReject(viewItem)}>رد درخواست</Button>
                </>
              )}
              {viewItem.status === 'accepted' && getAppConversationId(viewItem) && (
                <Button variant="primary" onClick={() => navigate(`/factory/messages?conversation=${getAppConversationId(viewItem)}`)}>
                  <MessageSquare size={16} />
                  ورود به چت
                </Button>
              )}
              <Button variant="ghost" onClick={() => setViewItem(null)}>بستن</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}