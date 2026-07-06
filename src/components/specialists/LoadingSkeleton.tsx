import styles from './LoadingSkeleton.module.css'

export default function LoadingSkeleton() {
  return (
    <div className={styles.grid} aria-label="در حال بارگذاری">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.avatar} />
          <div className={`${styles.line} ${styles.lineMedium}`} />
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={styles.skillRow}>
            <div className={styles.skill} />
            <div className={styles.skill} />
            <div className={styles.skill} />
          </div>
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={`${styles.line}`} />
        </div>
      ))}
    </div>
  )
}
