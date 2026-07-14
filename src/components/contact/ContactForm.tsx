import { useState } from 'react'
import { Send, LogIn, ChevronDown, Tag } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import Select from '../common/Select'
import styles from './ContactForm.module.css'

interface FormData {
  title: string
  fields: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }
  subjects: string[]
  validation: Record<string, string>
  successMessage: string
  errorMessage: string
  submitText: string
}

interface ContactFormProps {
  form: FormData
}

export default function ContactForm({ form }: ContactFormProps) {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = form.validation.nameRequired
    if (!email.trim()) errs.email = form.validation.emailRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = form.validation.emailInvalid
    if (!phone.trim()) errs.phone = form.validation.phoneRequired
    if (!subject) errs.subject = form.validation.subjectRequired
    if (!message.trim()) errs.message = form.validation.messageRequired
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) return
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
    }, 1500)
  }

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{form.title}</h3>

      {!isLoggedIn ? (
        <div className={styles.authPrompt}>
          <div className={styles.authPromptIcon}>
            <LogIn size={24} />
          </div>
          <p className={styles.authPromptText}>برای ارسال پیام لطفاً وارد حساب کاربری خود شوید.</p>
          <Link to="/login" className={styles.authBtn}>
            <LogIn size={14} />
            ورود به حساب
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {submitted && (
            <div className={styles.success}>
              <p>{form.successMessage}</p>
            </div>
          )}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">{form.fields.name}</label>
              <input
                id="contact-name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-email">{form.fields.email}</label>
              <input
                id="contact-email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-phone">{form.fields.phone}</label>
              <input
                id="contact-phone"
                type="tel"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
            <div className={styles.field}>
              <Select
                label={form.fields.subject}
                icon={Tag}
                value={subject}
                error={errors.subject}
                onChange={(value) => { setSubject(value); setErrors((prev) => ({ ...prev, subject: '' })) }}
                placeholder="انتخاب کنید"
                options={[
                  { value: '', label: 'انتخاب کنید' },
                  ...form.subjects.map((s) => ({ value: s, label: s })),
                ]}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">{form.fields.message}</label>
            <textarea
              id="contact-message"
              className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Send size={14} />
                {form.submitText}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
