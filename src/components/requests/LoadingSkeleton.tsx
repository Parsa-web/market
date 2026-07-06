import styles from './LoadingSkeleton.module.css'

export default function LoadingSkeleton() {
  return (
    <div className={styles.grid} aria-label="در حال بارگذاری">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.badges}>
            <div className={styles.badge} />
            <div className={styles.badge} />
          </div>
          <div className={`${styles.line} ${styles.lineTitle}`} />
          <div className={`${styles.line} ${styles.lineMedium}`} />
          <div className={styles.metaRow}>
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
          <div className={styles.infoRow}>
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={styles.skillRow}>
            <div className={styles.skill} />
            <div className={styles.skill} />
            <div className={styles.skill} />
          </div>
          <div className={styles.footerRow}>
            <div className={styles.line} />
            <div className={styles.btnPlaceholder} />
          </div>
        </div>
      ))}
    </div>
  )
}
