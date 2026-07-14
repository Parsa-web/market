import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Briefcase, CheckCircle, Languages } from 'lucide-react'
import type { Specialist } from './types'
import Rating from './Rating'
import AvailabilityBadge from './AvailabilityBadge'
import PortfolioGallery from './PortfolioGallery'
import ExperienceTimeline from './ExperienceTimeline'
import styles from './ProfileModal.module.css'

interface ProfileModalProps {
  specialist: Specialist | null
  onClose: () => void
}

export default function ProfileModal({ specialist, onClose }: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!specialist) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    modalRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [specialist, onClose])

  if (!specialist) return null

  const fullName = `${specialist.firstName} ${specialist.lastName}`
  const initials = `${specialist.firstName.charAt(0)}${specialist.lastName.charAt(0)}`

  return (
    <AnimatePresence>
      {specialist && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          role="dialog"
          aria-modal="true"
          aria-label={`پروفایل ${fullName}`}
        >
          <motion.div
            ref={modalRef}
            className={styles.modal}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="بستن">
              <X size={18} />
            </button>

            <div className={styles.body}>
              <div className={styles.header}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.headerInfo}>
                  <h2 className={styles.name}>{fullName}</h2>
                  <div className={styles.role}>{specialist.jobTitle}</div>
                  <div className={styles.headerBadges}>
                    <AvailabilityBadge status={specialist.availability} />
                    <Rating value={specialist.rating} />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>درباره</h3>
                <p className={styles.about}>{specialist.about}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>اطلاعات</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><MapPin size={13} /> شهر</span>
                    <span className={styles.infoValue}>{specialist.city}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Briefcase size={13} /> سابقه</span>
                    <span className={styles.infoValue}>{specialist.experienceYears} سال</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><CheckCircle size={13} /> پروژه‌ها</span>
                    <span className={styles.infoValue}>{specialist.projectsCompleted} پروژه</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Languages size={13} /> زبان‌ها</span>
                    <span className={styles.infoValue}>{specialist.languages.join('، ')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>مهارت‌ها</h3>
                <div className={styles.tagGrid}>
                  {specialist.skills.map((s) => <span key={s} className={styles.tag}>{s}</span>)}
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>ماشین‌آلات</h3>
                <div className={styles.tagGrid}>
                  {specialist.machines.map((m) => <span key={m} className={styles.tag}>{m}</span>)}
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>برندها</h3>
                <div className={styles.tagGrid}>
                  {specialist.brands.map((b) => <span key={b} className={styles.tag}>{b}</span>)}
                </div>
              </div>

              {specialist.certificates.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>مدارک و گواهینامه‌ها</h3>
                  <div className={styles.tagGrid}>
                    {specialist.certificates.map((c) => <span key={c} className={styles.tag}>{c}</span>)}
                  </div>
                </div>
              )}

              {specialist.portfolio.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>نمونه کارها</h3>
                  <PortfolioGallery items={specialist.portfolio} />
                </div>
              )}

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>تجربیات مهارتی</h3>
                <ExperienceTimeline specialist={specialist} />
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
