import { motion } from 'framer-motion'
import styles from './Timeline.module.css'

interface TimelineStep {
  step: number
  title: string
  description: string
}

interface TimelineProps {
  steps: TimelineStep[]
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className={styles.timeline}>
      {steps.map((item, i) => (
        <motion.div
          key={item.step}
          className={styles.item}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className={styles.marker}>
            <div className={styles.dot} />
            {i < steps.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <div className={styles.stepNumber}>{item.step}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.desc}>{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
