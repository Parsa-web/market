import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Calendar, Clock } from 'lucide-react'
import type { IndustrialRequest } from './types'
import styles from './ApplicationModal.module.css'

interface ApplicationModalProps {
  request: IndustrialRequest | null
  onClose: () => void
}

export default function ApplicationModal({ request, onClose }: ApplicationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('')
  const [availability, setAvailability] = useState('available')
  const [startDate, setStartDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setMessage('')
      setStartDate('')
    }, 2000)
  }

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
          aria-label="ارسال درخواست همکاری"
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
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>
                    <Send size={24} />
                  </div>
                  <h3 className={styles.successTitle}>درخواست شما ارسال شد</h3>
                  <p className={styles.successDesc}>
                    درخواست همکاری شما برای «{request.title}» با موفقیت ارسال شد.
                    کارخانه {request.factoryName} درخواست شما را بررسی خواهد کرد.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={styles.header}>
                    <h2 className={styles.title}>ارسال درخواست همکاری</h2>
                    <p className={styles.subtitle}>{request.title}</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="app-message">پیام کوتاه</label>
                    <textarea
                      id="app-message"
                      className={styles.textarea}
                      placeholder="تجربیات و مهارت‌های خود را شرح دهید..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="app-availability">
                      <Clock size={13} /> وضعیت در دسترس
                    </label>
                    <select
                      id="app-availability"
                      className={styles.select}
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="available">فعال - آماده همکاری</option>
                      <option value="busy">مشغول - در اولویت بعدی</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="app-date">
                      <Calendar size={13} /> تاریخ شروع مورد انتظار
                    </label>
                    <input
                      id="app-date"
                      type="text"
                      className={styles.input}
                      placeholder="مثلاً ۱۴۰۵/۰۵/۰۱"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn}>
                      <Send size={14} />
                      ارسال درخواست
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                      انصراف
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
