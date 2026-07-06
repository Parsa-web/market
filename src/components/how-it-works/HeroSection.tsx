import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'
import heroImage from '../../assets/images/how-it-works-hero.png'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.section} aria-label="چطور صنعت نت کار می‌کند">
      <div className={styles.layout}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>
            چطور صنعت‌نت کار می‌کند؟
          </h1>
          <p className={styles.subtitle}>
            صنعت‌نت پلتفرم تخصصی اتصال کارخانه‌ها و صنایع به متخصصان فنی باتجربه است.
            نیازهای صنعتی خود را ثبت کنید و متخصصان مناسب را پیدا کنید.
          </p>
          <div className={styles.actions}>
            <Link to="/register?role=factory" className={styles.btnPrimary}>
              <Building2 size={18} />
              ثبت‌نام کارخانه
            </Link>
            <Link to="/register?role=specialist" className={styles.btnOutline}>
              <Users size={18} />
              ثبت‌نام متخصص
            </Link>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={heroImage}
            alt="تصویر صنعت نت"
            className={styles.illustration}
          />
        </motion.div>
      </div>
    </section>
  )
}
