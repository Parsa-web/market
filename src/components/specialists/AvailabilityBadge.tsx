import type { Availability } from './types'
import styles from './AvailabilityBadge.module.css'

interface AvailabilityBadgeProps {
  status: Availability
}

const labels: Record<Availability, string> = {
  available: 'فعال',
  busy: 'مشغول',
}

export default function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`} aria-label={`وضعیت: ${labels[status]}`}>
      <span className={styles.dot} />
      {labels[status]}
    </span>
  )
}
