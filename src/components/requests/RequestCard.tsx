import { motion } from 'framer-motion'
import { MapPin, Building2, ChevronLeft, Award } from 'lucide-react'
import { formatBudget } from '../../utils/dashboardUtils'
import type { IndustrialRequest } from './types'
import styles from './RequestCard.module.css'

interface RequestCardProps {
  request: IndustrialRequest & { matched?: boolean }
  onSelect: (id: number) => void
  onApply: (id: number) => void
}

export default function RequestCard({ request, onSelect, onApply }: RequestCardProps) {
  const displaySkills = request.requiredSkills.slice(0, 4)

  return (
    <motion.div
      className={`${styles.card}${request.matched ? ` ${styles.cardMatched}` : ''}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      aria-label={request.title}
    >
      <div className={styles.accent} />

      {request.matched && (
        <div className={styles.matchBadge}>
          <Award size={11} />
          مناسب مهارت‌های شما
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.icon}><Building2 size={16} /></div>
          <div className={styles.titleInfo}>
            <h3 className={styles.title}>{request.title}</h3>
            <div className={styles.factoryName}>{request.factoryName}</div>
          </div>
        </div>
      </div>

      <div className={styles.skills}>
        {displaySkills.map((s) => (
          <span key={s} className={styles.skill}>{s}</span>
        ))}
        {request.requiredSkills.length > 4 && (
          <span className={styles.skill}>+{request.requiredSkills.length - 4}</span>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={12} className={styles.metaIcon} />
            {request.city}
          </span>
          <span className={styles.metaDot} />
          <span className={styles.budget}>{formatBudget(request.budget)}</span>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.detailBtn} onClick={() => onSelect(request.id)}>
            جزئیات
            <ChevronLeft size={13} />
          </button>
          <button type="button" className={styles.applyBtn} onClick={() => onApply(request.id)}>
            درخواست
          </button>
        </div>
      </div>
    </motion.div>
  )
}
