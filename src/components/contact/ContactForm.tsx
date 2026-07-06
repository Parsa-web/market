import { useState } from 'react'
import { Send } from 'lucide-react'
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
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
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

      {submitted ? (
        <div className={styles.success}>
          <p>{form.successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
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
              <label className={styles.label} htmlFor="contact-subject">{form.fields.subject}</label>
              <select
                id="contact-subject"
                className={`${styles.select} ${errors.subject ? styles.inputError : ''}`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">انتخاب کنید</option>
                {form.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
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
