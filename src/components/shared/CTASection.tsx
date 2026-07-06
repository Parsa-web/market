import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'
import styles from './CTASection.module.css'

interface CTASectionProps {
  title: string
  subtitle: string
  factoryBtn: string
  specialistBtn: string
}

export default function CTASection({ title, subtitle, factoryBtn, specialistBtn }: CTASectionProps) {
  return (
    <section className={styles.cta} aria-label="دعوت به اقدام">
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.actions}>
            <Link to="/register?role=factory" className={styles.btnPrimary}>
              <Building2 size={18} />
              {factoryBtn}
            </Link>
            <Link to="/register?role=specialist" className={styles.btnOutline}>
              <Users size={18} />
              {specialistBtn}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
