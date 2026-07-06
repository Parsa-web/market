import type { RequestStatus } from './types'
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: RequestStatus
}

const labels: Record<RequestStatus, string> = {
  open: 'باز',
  closed: 'بسته شده',
  in_progress: 'در حال انجام',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`} aria-label={`وضعیت: ${labels[status]}`}>
      <span className={styles.dot} />
      {labels[status]}
    </span>
  )
}
