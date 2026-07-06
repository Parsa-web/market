import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './StatsSection.module.css'

interface Stat {
  value: number
  suffix: string
  label: string
}

interface StatsSectionProps {
  stats: Stat[]
}

function AnimatedNumber({ to, suffix }: { to: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const start = performance.now()

          function animate(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * to))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  return <span ref={ref}>{display}{suffix}</span>
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className={styles.card}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className={styles.number}>
            <AnimatedNumber to={stat.value} suffix={stat.suffix} />
          </div>
          <div className={styles.label}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
