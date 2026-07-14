import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Building2, Calendar, Clock, Users, Paperclip, Wrench, Tag } from 'lucide-react'
import type { IndustrialRequest } from './types'
import UrgencyBadge from './UrgencyBadge'
import BudgetBadge from './BudgetBadge'
import { useAuth } from '../../hooks/useAuth'
import { formatPersianDate } from '../../utils/dashboardUtils'
import styles from './RequestModal.module.css'

interface RequestModalProps {
  request: IndustrialRequest | null
  onClose: () => void
  onApply: (id: number) => void
}

export default function RequestModal({ request, onClose, onApply }: RequestModalProps) {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!request) return
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
  }, [request, onClose])

  if (!request) return null

  return (
    <AnimatePresence>
      {request && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          role="dialog"
          aria-modal="true"
          aria-label={request.title}
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
                <div className={styles.headerBadges}>
                  <UrgencyBadge urgency={request.urgency} />
                </div>
                <h2 className={styles.title}>{request.title}</h2>
                <div className={styles.factory}>
                  <Building2 size={15} />
                  {request.factoryName}
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>توضیحات درخواست</h3>
                <p className={styles.about}>{request.description}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>اطلاعات درخواست</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Tag size={13} /> صنعت</span>
                    <span className={styles.infoValue}>{request.industry}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Wrench size={13} /> دستگاه</span>
                    <span className={styles.infoValue}>{request.machine}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Wrench size={13} /> برند</span>
                    <span className={styles.infoValue}>{request.brand}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><MapPin size={13} /> موقعیت</span>
                    <span className={styles.infoValue}>{request.city}، {request.province}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Calendar size={13} /> مهلت</span>
                    <span className={styles.infoValue}>{request.deadline}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Clock size={13} /> مدت اجرا</span>
                    <span className={styles.infoValue}>{request.estimatedDuration}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}><Users size={13} /> درخواست‌ها</span>
                    <span className={styles.infoValue}>{request.applicationsCount} نفر</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>تاریخ انتشار</span>
                    <span className={styles.infoValue}>{formatPersianDate(request.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>مهارت‌های مورد نیاز</h3>
                <div className={styles.tagGrid}>
                  {request.requiredSkills.map((s) => <span key={s} className={styles.tag}>{s}</span>)}
                </div>
              </div>

              {request.attachments.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>پیوست‌ها</h3>
                  <div className={styles.attachments}>
                    {request.attachments.map((a) => (
                      <div key={a} className={styles.attachmentItem}>
                        <Paperclip size={14} />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <BudgetBadge budget={request.budget} />
              </div>

              <div className={styles.cta}>
                {!isLoggedIn && (
                  <p className={styles.ctaText}>
                    برای ارسال درخواست همکاری، ابتدا در صنعت‌نت ثبت‌نام کنید.
                  </p>
                )}
                <div className={styles.ctaActions}>
                  <button
                    type="button"
                    className={styles.ctaBtn}
                    onClick={() => onApply(request.id)}
                  >
                    ارسال درخواست همکاری
                  </button>
                  <button
                    type="button"
                    className={styles.ctaBtnOutline}
                    onClick={onClose}
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
