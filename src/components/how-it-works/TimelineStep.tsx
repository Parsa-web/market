import { motion } from 'framer-motion'
import type { FC, ElementType } from 'react'
import styles from './TimelineStep.module.css'

interface TimelineStepProps {
  index: number
  icon: ElementType
  title: string
  desc: string
  variant?: 'factory' | 'specialist'
}

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const TimelineStep: FC<TimelineStepProps> = ({ index, icon: Icon, title, desc, variant = 'factory' }) => {
  const isSpecialist = variant === 'specialist'

  return (
    <motion.div
      className={`${styles.step} ${isSpecialist ? styles.stepSpecialist : ''}`}
      variants={stepVariants}
    >
      <div className={`${styles.stepNumber} ${isSpecialist ? styles.stepNumberSpecialist : ''}`}>
        {index + 1}
      </div>
      <div className={styles.content}>
        <div className={`${styles.contentHeader} ${isSpecialist ? styles.contentHeaderSpecialist : ''}`}>
          <Icon size={18} className={styles.stepIcon} />
          <h3 className={styles.stepTitle}>{title}</h3>
        </div>
        <p className={`${styles.stepDesc} ${isSpecialist ? styles.stepDescSpecialist : ''}`}>{desc}</p>
      </div>
    </motion.div>
  )
}

export default TimelineStep
