import { Check, Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant, APPLICATION_STATUS_LABELS } from '../../utils/dashboardUtils'
import { useFactory } from '../../hooks/useFactory'

export default function FactoryApplicationsPage() {
  const { applications, markApplicationsSeen, updateApplicationStatus } = useFactory()
  const [viewItem, setViewItem] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  useEffect(() => {
    markApplicationsSeen()
  }, [markApplicationsSeen])

  const handleAccept = async (app) => {
    try {
      await updateApplicationStatus(app.id, 'accepted')
      showSuccess('درخواست متخصص پذیرفته شد. پروژه شروع شد.')
      setViewItem(null)
    } catch {
      showSuccess('خطا در پذیرش درخواست')
    }
  }

  const handleReject = async (app) => {
    try {
      await updateApplicationStatus(app.id, 'rejected')
      showSuccess('درخواست متخصص رد شد')
      setViewItem(null)
    } catch {
      showSuccess('خطا در رد درخواست')
    }
  }

  const appList = applications || []

  if (appList.length === 0) {
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

      <p className="dash-page-desc">{appList.length} درخواست همکاری دریافت شده</p>

      <div className="dash-table-card">
        <table className="dash-table">
          <thead>
            <tr>
              <th>متخصص</th>
              <th>نیاز صنعتی</th>
              <th>پیام</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {appList.map((app) => (
              <tr key={app.id}>
                <td className="dash-table-name">{app.specialistName || `متخصص #${app.specialistId}`}</td>
                <td>{app.requestTitle}</td>
                <td className="dash-table-message">{app.message || '—'}</td>
                <td>
                  <Badge variant={getApplicationStatusVariant(app.status)}>
                    {APPLICATION_STATUS_LABELS[app.status] || app.status}
                  </Badge>
                </td>
                <td>{formatPersianDate(app.createdAt)}</td>
                <td>
                  <div className="dash-table-actions">
                    <Button variant="ghost" className="dash-btn-sm" onClick={() => setViewItem(app)}>
                      <Eye size={14} />
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button variant="primary" className="dash-btn-sm" onClick={() => handleAccept(app)}>
                          <Check size={14} />
                        </Button>
                        <Button variant="outline" className="dash-btn-sm" onClick={() => handleReject(app)}>
                          <X size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <Button variant="ghost" onClick={() => setViewItem(null)}>بستن</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
