import type { Urgency } from './types'
import styles from './UrgencyBadge.module.css'

interface UrgencyBadgeProps {
  urgency: Urgency
}

const labels: Record<Urgency, string> = {
  high: 'فوری',
  medium: 'متوسط',
  low: 'عادی',
}

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[urgency]}`} aria-label={`اولویت: ${labels[urgency]}`}>
      {labels[urgency]}
    </span>
  )
}
