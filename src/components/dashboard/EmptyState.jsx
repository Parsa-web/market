import { Inbox } from 'lucide-react'
import Button from '../common/Button'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'موردی یافت نشد',
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="dash-empty">
      <div className="dash-empty-icon">
        <Icon size={32} />
      </div>
      <h3 className="dash-empty-title">{title}</h3>
      {description && <p className="dash-empty-desc">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
