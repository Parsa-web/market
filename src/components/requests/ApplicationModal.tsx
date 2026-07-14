import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Calendar, Clock, Building2, Wallet, Tag, Award, AlertTriangle, LogIn, UserPlus, CheckCircle, MessageSquare, Paperclip, FileText, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { IndustrialRequest } from './types'
import { useAuth } from '../../hooks/useAuth'
import { formatBudget } from '../../utils/dashboardUtils'
import styles from './ApplicationModal.module.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const MAX_FILE_SIZE = 10 * 1024 * 1024

interface AttachedFile {
  name: string
  data: string
  size: number
}

interface ApplicationModalProps {
  request: IndustrialRequest | null
  onClose: () => void
  onSubmit?: (data: { message: string; startDate: string; attachments?: AttachedFile[] }) => Promise<void>
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'))
    reader.readAsDataURL(file)
  })
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function ApplicationModal({ request, onClose, onSubmit }: ApplicationModalProps) {
  const { user } = useAuth()
  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [availability, setAvailability] = useState('available')
  const [startDate, setStartDate] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [fileError, setFileError] = useState('')

  const isLoggedIn = !!user
  const isSpecialist = user?.role === 'specialist'

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')
    if (file.size > MAX_FILE_SIZE) {
      setFileError('حجم فایل باید کمتر از ۱۰ مگابایت باشد')
      e.target.value = ''
      return
    }
    try {
      const data = await fileToBase64(file)
      setAttachedFiles((prev) => [...prev, { name: file.name, data, size: file.size }])
    } catch {
      setFileError('خطا در خواندن فایل')
    }
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setError('')
    setSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit({ message, startDate, attachments: attachedFiles.length > 0 ? attachedFiles : undefined })
      } else if (isSpecialist) {
        const specRes = await fetch(`${API_BASE}/specialists?userId=${user.id}`)
        const specs = await specRes.json()
        const specialistId = specs[0]?.id
        if (!specialistId) throw new Error('پروفایل متخصص یافت نشد')

        const factoryRes = await fetch(`${API_BASE}/industrialRequests/${request.id}`)
        const reqData = await factoryRes.json()
        const factoryId = reqData.factoryId
        if (!factoryId) throw new Error('اطلاعات نیاز یافت نشد')

        await fetch(`${API_BASE}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId: request.id,
            factoryId,
            specialistId,
            message,
            availableStartDate: startDate,
            additionalDescription: '',
            attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
            status: 'pending',
            createdAt: new Date().toISOString(),
          }),
        })
      } else {
        throw new Error('شما دسترسی ارسال درخواست را ندارید')
      }
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setMessage('')
        setStartDate('')
        setAttachedFiles([])
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال درخواست')
      setSubmitting(false)
    }
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
                <motion.div
                  className={styles.success}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.successIcon}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 className={styles.successTitle}>درخواست شما ارسال شد</h3>
                  <p className={styles.successDesc}>
                    درخواست همکاری شما برای «{request.title}» با موفقیت ارسال شد.
                    کارخانه {request.factoryName} درخواست شما را بررسی خواهد کرد.
                  </p>
                </motion.div>
              ) : !isLoggedIn ? (
                <motion.div
                  className={styles.authPrompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.authPromptIcon}>
                    <LogIn size={28} />
                  </div>
                  <h3 className={styles.authPromptTitle}>ورود به صنعت‌نت</h3>
                  <p className={styles.authPromptDesc}>
                    برای ارسال درخواست همکاری، لطفاً ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
                  </p>
                  <div className={styles.authPromptActions}>
                    <Link to="/login" className={styles.authBtnPrimary}>
                      <LogIn size={16} />
                      ورود
                    </Link>
                    <Link to="/register" className={styles.authBtnOutline}>
                      <UserPlus size={16} />
                      ثبت‌نام
                    </Link>
                  </div>
                </motion.div>
              ) : !isSpecialist ? (
                <motion.div
                  className={styles.authPrompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.authPromptIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
                    <AlertTriangle size={28} />
                  </div>
                  <h3 className={styles.authPromptTitle}>حساب متخصص ندارید</h3>
                  <p className={styles.authPromptDesc}>
                    برای ارسال درخواست همکاری باید با حساب متخصص وارد شده باشید.
                    شما با حساب کارخانه وارد شده‌اید.
                  </p>
                  <Link to="/register?role=specialist" className={styles.authBtnPrimary}>
                    <UserPlus size={16} />
                    ثبت‌نام به عنوان متخصص
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={styles.header}>
                    <div className={styles.headerInfo}>
                      <h2 className={styles.title}>ارسال درخواست همکاری</h2>
                      <p className={styles.subtitle}>{request.factoryName}</p>
                    </div>
                  </div>

                  <div className={styles.requestSummary}>
                    <div className={styles.summaryRow}>
                      <Tag size={14} />
                      <span className={styles.summaryLabel}>عنوان نیاز</span>
                      <span className={styles.summaryValue}>{request.title}</span>
                    </div>
                    <div className={styles.summaryDivider} />
                    <div className={styles.summaryRow}>
                      <Building2 size={14} />
                      <span className={styles.summaryLabel}>صنعت</span>
                      <span className={styles.summaryValue}>{request.industry}</span>
                    </div>
                    <div className={styles.summaryDivider} />
                    <div className={styles.summaryRow}>
                      <Wallet size={14} />
                      <span className={styles.summaryLabel}>بودجه</span>
                      <span className={styles.summaryValue}>{formatBudget(request.budget)}</span>
                    </div>
                    <div className={styles.summaryDivider} />
                    <div className={styles.summaryRow}>
                      <Award size={14} />
                      <span className={styles.summaryLabel}>دستگاه</span>
                      <span className={styles.summaryValue}>{request.machine} - {request.brand}</span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="app-message">
                      <MessageSquare size={14} /> پیام به کارخانه
                    </label>
                    <textarea
                      id="app-message"
                      className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
                      placeholder="تجربیات مرتبط خود را شرح دهید، پروژه‌های مشابهی که انجام داده‌اید و دلیل علاقه‌تان به این همکاری..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                    <div className={styles.charCount}>{message.length} کاراکتر</div>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="app-availability">
                        <Clock size={14} /> وضعیت شغلی
                      </label>
                      <div className={styles.toggleGroup}>
                        <button
                          type="button"
                          className={`${styles.toggleBtn} ${availability === 'available' ? styles.toggleActive : ''}`}
                          onClick={() => setAvailability('available')}
                        >
                          <CheckCircle size={14} />
                          <span>آماده همکاری فوری</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.toggleBtn} ${availability === 'busy' ? styles.toggleActive : ''}`}
                          onClick={() => setAvailability('busy')}
                        >
                          <Clock size={14} />
                          <span>زمان محدود</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="app-date">
                        <Calendar size={14} /> تاریخ شروع پیشنهادی
                      </label>
                      <input
                        id="app-date"
                        type="date"
                        className={styles.input}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      <Paperclip size={14} /> پیوست فایل (اختیاری)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={handleFileSelect}
                    />
                    <button type="button" className={styles.attachBtn} onClick={() => fileInputRef.current?.click()}>
                      <Paperclip size={16} />
                      افزودن فایل
                    </button>
                    {fileError && <div className={styles.fileError}>{fileError}</div>}
                    {attachedFiles.length > 0 && (
                      <div className={styles.fileList}>
                        {attachedFiles.map((f, i) => (
                          <div key={i} className={styles.fileItem}>
                            <FileText size={16} />
                            <div className={styles.fileInfo}>
                              <span className={styles.fileName}>{f.name}</span>
                              <span className={styles.fileSize}>{formatFileSize(f.size)}</span>
                            </div>
                            <button type="button" className={styles.fileRemove} onClick={() => removeFile(i)}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && <div className={styles.formError}>{error}</div>}

                  <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={submitting || !message.trim()}>
                      <Send size={14} />
                      {submitting ? 'در حال ارسال...' : 'ارسال درخواست همکاری'}
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