import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  title: string
  subtitle: string
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </motion.div>
      </div>
    </section>
  )
}
