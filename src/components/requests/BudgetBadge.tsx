import { Wallet } from 'lucide-react'
import { formatBudget } from '../../utils/dashboardUtils'
import styles from './BudgetBadge.module.css'

interface BudgetBadgeProps {
  budget: string
}

export default function BudgetBadge({ budget }: BudgetBadgeProps) {
  return (
    <span className={styles.badge} aria-label={`بودجه: ${budget}`}>
      <Wallet size={12} />
      {formatBudget(budget)}
    </span>
  )
}
