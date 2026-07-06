import { motion } from 'framer-motion'
import { MapPin, Briefcase, CheckCircle } from 'lucide-react'
import type { Specialist } from './types'
import Rating from './Rating'
import AvailabilityBadge from './AvailabilityBadge'
import styles from './SpecialistCard.module.css'

interface SpecialistCardProps {
  specialist: Specialist
  onSelect: (id: number) => void
}

export default function SpecialistCard({ specialist, onSelect }: SpecialistCardProps) {
  const fullName = `${specialist.firstName} ${specialist.lastName}`
  const initials = `${specialist.firstName.charAt(0)}${specialist.lastName.charAt(0)}`
  const displaySkills = specialist.skills.slice(0, 3)

  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(specialist.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(specialist.id) } }}
      role="button"
      tabIndex={0}
      aria-label={`پروفایل ${fullName}`}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.headerInfo}>
          <div className={styles.name}>{fullName}</div>
          <div className={styles.role}>{specialist.jobTitle}</div>
        </div>
      </div>

      <div className={styles.badges}>
        <AvailabilityBadge status={specialist.availability} />
        <Rating value={specialist.rating} />
      </div>

      <div className={styles.skills}>
        {displaySkills.map((s) => (
          <span key={s} className={styles.skill}>{s}</span>
        ))}
        {specialist.skills.length > 3 && (
          <span className={styles.skill}>+{specialist.skills.length - 3}</span>
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <MapPin size={13} className={styles.metaIcon} />
          {specialist.city}
        </div>
        <div className={styles.metaItem}>
          <Briefcase size={13} className={styles.metaIcon} />
          {specialist.experienceYears} سال تجربه
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.progress}>
          <CheckCircle size={13} className={styles.metaIcon} />
          <span>تکمیل پروفایل</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${specialist.profileCompletion}%` }} />
          </div>
          <span>{specialist.profileCompletion}%</span>
        </div>
        <button
          type="button"
          className={styles.viewBtn}
          onClick={(e) => { e.stopPropagation(); onSelect(specialist.id) }}
        >
          مشاهده پروفایل
        </button>
      </div>
    </motion.div>
  )
}
