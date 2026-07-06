import { motion } from 'framer-motion'
import { MapPin, Building2, Calendar, Clock, Users, Paperclip } from 'lucide-react'
import type { IndustrialRequest } from './types'
import StatusBadge from './StatusBadge'
import UrgencyBadge from './UrgencyBadge'
import BudgetBadge from './BudgetBadge'
import styles from './RequestCard.module.css'

interface RequestCardProps {
  request: IndustrialRequest
  onSelect: (id: number) => void
  onApply: (id: number) => void
}

export default function RequestCard({ request, onSelect, onApply }: RequestCardProps) {
  const displaySkills = request.requiredSkills.slice(0, 4)

  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      aria-label={request.title}
    >
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <StatusBadge status={request.status} />
          <UrgencyBadge urgency={request.urgency} />
        </div>
        <h3 className={styles.title}>{request.title}</h3>
        <div className={styles.factory}>
          <Building2 size={14} className={styles.metaIcon} />
          {request.factoryName}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <MapPin size={13} className={styles.metaIcon} />
          {request.city}، {request.province}
        </div>
        <div className={styles.metaItem}>
          <Calendar size={13} className={styles.metaIcon} />
          مهلت: {request.deadline}
        </div>
        <div className={styles.metaItem}>
          <Clock size={13} className={styles.metaIcon} />
          مدت اجرا: {request.estimatedDuration}
        </div>
        <div className={styles.metaItem}>
          <Users size={13} className={styles.metaIcon} />
          {request.applicationsCount} درخواست
        </div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoChip}>
          <span className={styles.infoLabel}>صنعت:</span> {request.industry}
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoLabel}>دستگاه:</span> {request.machine}
        </div>
        <div className={styles.infoChip}>
          <span className={styles.infoLabel}>برند:</span> {request.brand}
        </div>
      </div>

      <p className={styles.description}>{request.description}</p>

      <div className={styles.skills}>
        {displaySkills.map((s) => (
          <span key={s} className={styles.skill}>{s}</span>
        ))}
        {request.requiredSkills.length > 4 && (
          <span className={styles.skill}>+{request.requiredSkills.length - 4}</span>
        )}
      </div>

      <div className={styles.footer}>
        <BudgetBadge budget={request.budget} />
        <div className={styles.actions}>
          {request.attachments.length > 0 && (
            <span className={styles.attachmentCount}>
              <Paperclip size={12} />
              {request.attachments.length}
            </span>
          )}
          <button
            type="button"
            className={styles.detailBtn}
            onClick={() => onSelect(request.id)}
          >
            مشاهده جزئیات
          </button>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={() => onApply(request.id)}
          >
            ارسال درخواست همکاری
          </button>
        </div>
      </div>
    </motion.div>
  )
}
