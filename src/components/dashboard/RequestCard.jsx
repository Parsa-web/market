import { Link } from 'react-router-dom'
import Badge from './Badge'
import Button from '../common/Button'
import { formatPersianDate, getStatusVariant } from '../../utils/dashboardUtils'

export default function RequestCard({ request, onView, onEdit, onClose, onDelete, compact = false }) {
  const variant = getStatusVariant(request.status)

  return (
    <article className={`dash-request-card${compact ? ' dash-request-card--compact' : ''}`}>
      <div className="dash-request-card-top">
        <h3 className="dash-request-card-title">{request.title}</h3>
        <Badge variant={variant}>{request.status}</Badge>
      </div>

      <div className="dash-request-card-details">
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">تخصص</span>
          <span>{request.specialty}</span>
        </div>
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">دستگاه</span>
          <span>{request.equipment}</span>
        </div>
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">برند</span>
          <span>{request.brand}</span>
        </div>
        {!compact && request.city && (
          <div className="dash-request-detail">
            <span className="dash-request-detail-label">شهر</span>
            <span>{request.city}</span>
          </div>
        )}
      </div>

      <div className="dash-request-card-footer">
        <span className="dash-request-date">{formatPersianDate(request.createdAt)}</span>
        <div className="dash-request-actions">
          {onView && (
            <Button variant="ghost" className="dash-btn-sm" onClick={() => onView(request)}>
              مشاهده
            </Button>
          )}
          {onEdit && request.status !== 'بسته شده' && request.status !== 'تکمیل شده' && (
            <Button variant="outline" className="dash-btn-sm" onClick={() => onEdit(request)}>
              ویرایش
            </Button>
          )}
          {onClose && (request.status === 'فعال' || request.status === 'در انتظار') && (
            <Button variant="ghost" className="dash-btn-sm" onClick={() => onClose(request)}>
              بستن
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" className="dash-btn-sm dash-btn-danger" onClick={() => onDelete(request)}>
              حذف
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export function RequestCardLink({ request, to }) {
  const variant = getStatusVariant(request.status)

  return (
    <Link to={to} className="dash-request-card dash-request-card--link">
      <div className="dash-request-card-top">
        <h3 className="dash-request-card-title">{request.title}</h3>
        <Badge variant={variant}>{request.status}</Badge>
      </div>
      <div className="dash-request-card-details">
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">تخصص</span>
          <span>{request.specialty}</span>
        </div>
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">دستگاه</span>
          <span>{request.equipment}</span>
        </div>
        <div className="dash-request-detail">
          <span className="dash-request-detail-label">برند</span>
          <span>{request.brand}</span>
        </div>
      </div>
      <div className="dash-request-card-footer">
        <span className="dash-request-date">{formatPersianDate(request.createdAt)}</span>
      </div>
    </Link>
  )
}
