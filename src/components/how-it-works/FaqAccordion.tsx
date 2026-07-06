import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './FaqAccordion.module.css'

const faqs = [
  {
    q: 'کارخانه‌ها چگونه متخصصان مناسب پیدا می‌کنند؟',
    a: 'کارخانه‌ها نیاز صنعتی خود را با جزئیات در پلتفرم ثبت می‌کنند. متخصصان واجد شرایط بر اساس تخصص و تجربه خود درخواست همکاری ارسال می‌کنند. کارخانه می‌تواند پروفایل متقاضیان را بررسی کرده و بهترین گزینه را انتخاب کند.',
  },
  {
    q: 'آیا متخصصان می‌توانند به چند درخواست همزمان اقدام کنند؟',
    a: 'بله، متخصصان می‌توانند به هر تعداد درخواست که متناسب با تخصص و زمان آنهاست، اقدام کنند. هیچ محدودیتی در تعداد درخواست‌های همکاری وجود ندارد.',
  },
  {
    q: 'ثبت‌نام در صنعت‌نت رایگان است؟',
    a: 'بله، ثبت‌نام برای هر دو گروه کارخانه‌ها و متخصصان کاملاً رایگان است. هیچ هزینه‌ای برای عضویت در پلتفرم دریافت نمی‌شود.',
  },
  {
    q: 'ارتباط بین کارخانه و متخصص چگونه شروع می‌شود؟',
    a: 'پس از ارسال درخواست همکاری توسط متخصص و تأیید کارخانه، سیستم پیام‌رسان داخلی فعال می‌شود. دو طرف می‌توانند مستقیماً گفتگو کرده و جزئیات همکاری را تنظیم کنند.',
  },
  {
    q: 'درخواست‌های همکاری چگونه مدیریت می‌شوند؟',
    a: 'هر دو طرف در پنل کاربری خود بخش مجزایی برای مدیریت درخواست‌ها دارند. وضعیت هر درخواست (در انتظار، تأیید شده، رد شده) مشخص است.',
  },
  {
    q: 'آیا می‌توان اطلاعات پروفایل را بعداً ویرایش کرد؟',
    a: 'بله، در هر زمان می‌توانید اطلاعات پروفایل خود را ویرایش کنید. کارخانه‌ها می‌توانند اطلاعات شرکت خود را به‌روز کنند و متخصصان نیز می‌توانند مهارت‌ها و سوابق خود را ویرایش نمایند.',
  },
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="faq-title" className={styles.title}>سوالات متداول</h2>
          <p className={styles.desc}>
            پاسخ به مهم‌ترین سوالات درباره صنعت‌نت
          </p>
        </div>

        <div className={styles.list} role="list" aria-label="سوالات متداول">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                role="listitem"
              >
                <button
                  className={styles.trigger}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  type="button"
                >
                  <span className={styles.triggerText}>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={styles.content}
                    >
                      <div className={styles.contentInner}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
