import { Wallet } from 'lucide-react'
import styles from './BudgetBadge.module.css'

interface BudgetBadgeProps {
  budget: string
}

export default function BudgetBadge({ budget }: BudgetBadgeProps) {
  return (
    <span className={styles.badge} aria-label={`بودجه: ${budget} تومان`}>
      <Wallet size={12} />
      {budget} تومان
    </span>
  )
}
