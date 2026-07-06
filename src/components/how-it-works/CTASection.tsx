import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'
import styles from './CTASection.module.css'

export default function CTASection() {
  return (
    <section className={styles.section} aria-label="شروع کنید">
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>آماده شروع هستید؟</h2>
          <p className={styles.desc}>
            ثبت‌نام رایگان است و چند دقیقه بیشتر زمان نمی‌برد.
            کارخانه باشید یا متخصص فنی، صنعت‌نت منتظر شماست.
          </p>
          <div className={styles.actions}>
            <Link to="/register?role=specialist" className={styles.btnPrimary}>
              <Users size={18} />
              ثبت‌نام متخصص
            </Link>
            <Link to="/register?role=factory" className={styles.btnOutline}>
              <Building2 size={18} />
              ثبت‌نام کارخانه
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
