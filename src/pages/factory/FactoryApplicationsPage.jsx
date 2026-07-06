import { Check, Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import Badge from '../../components/dashboard/Badge'
import { formatPersianDate, getApplicationStatusVariant } from '../../utils/dashboardUtils'
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

  const handleAccept = (app) => {
    updateApplicationStatus(app.id, 'پذیرفته شده')
    showSuccess(`درخواست ${app.specialistName} پذیرفته شد`)
    setViewItem(null)
  }

  const handleReject = (app) => {
    updateApplicationStatus(app.id, 'رد شده')
    showSuccess(`درخواست ${app.specialistName} رد شد`)
    setViewItem(null)
  }

  if (applications.length === 0) {
    return (
      <div className="dash-page">
        <EmptyState
          title="درخواستی دریافت نشده"
          description="وقتی متخصصان درخواست همکاری ارسال کنند، اینجا نمایش داده می‌شود."
        />
      </div>
    )
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <p className="dash-page-desc">{applications.length} درخواست همکاری دریافت شده</p>

      <div className="dash-table-card">
        <table className="dash-table">
          <thead>
            <tr>
              <th>متخصص</th>
              <th>درخواست مرتبط</th>
              <th>پیام</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="dash-table-name">{app.specialistName}</td>
                <td>{app.requestTitle}</td>
                <td className="dash-table-message">{app.message || '—'}</td>
                <td><Badge variant={getApplicationStatusVariant(app.status)}>{app.status}</Badge></td>
                <td>{formatPersianDate(app.createdAt)}</td>
                <td>
                  <div className="dash-table-actions">
                    <Button variant="ghost" className="dash-btn-sm" onClick={() => setViewItem(app)}>
                      <Eye size={14} />
                    </Button>
                    {app.status === 'در انتظار' && (
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

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="جزئیات درخواست">
        {viewItem && (
          <>
            <div className="dash-application-modal">
              <div className="dash-application-modal-head">
                <div>
                  <h3>{viewItem.specialistName}</h3>
                  <p>{viewItem.requestTitle}</p>
                </div>
              </div>
              <div className="dash-application-modal-grid">
                <div className="dash-application-modal-item">
                  <span>درخواست</span>
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
                  <span>شهر</span>
                  <strong>{viewItem.requestCity || '—'}</strong>
                </div>
              </div>
              {viewItem.message && (
                <div className="dash-application-modal-message">
                  <span>پیام متخصص</span>
                  <p>{viewItem.message}</p>
                </div>
              )}
              <div className="dash-application-modal-status">
                <span>وضعیت درخواست</span>
                <Badge variant={getApplicationStatusVariant(viewItem.status)}>{viewItem.status}</Badge>
              </div>
            </div>
            <div className="dash-modal-actions">
              {viewItem.status === 'در انتظار' && (
                <>
                  <Button variant="primary" onClick={() => handleAccept(viewItem)}>پذیرش</Button>
                  <Button variant="outline" onClick={() => handleReject(viewItem)}>رد</Button>
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
