import { SearchX } from 'lucide-react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  onReset: () => void
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.iconWrap}>
        <SearchX size={30} />
      </div>
      <h3 className={styles.title}>درخواستی یافت نشد</h3>
      <p className={styles.desc}>
        درخواست صنعتی با فیلترهای انتخاب شده پیدا نشد. لطفاً فیلترها را تغییر دهید یا دوباره جستجو کنید.
      </p>
      <button type="button" className={styles.resetBtn} onClick={onReset}>
        حذف همه فیلترها
      </button>
    </div>
  )
}
