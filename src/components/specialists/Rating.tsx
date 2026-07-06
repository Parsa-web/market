import { Star } from 'lucide-react'
import styles from './Rating.module.css'

interface RatingProps {
  value: number
}

export default function Rating({ value }: RatingProps) {
  return (
    <div className={styles.wrap} aria-label={`امتیاز ${value} از ۵`}>
      <Star size={14} className={styles.star} />
      <span className={styles.value}>{value.toFixed(1)}</span>
    </div>
  )
}
