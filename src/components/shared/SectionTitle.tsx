import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'center' | 'start'
}

export default function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
  return (
    <div className={`${styles.wrap} ${align === 'start' ? styles.start : ''}`}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
