import type { Specialist } from './types'
import styles from './ExperienceTimeline.module.css'

interface ExperienceTimelineProps {
  specialist: Specialist
}

export default function ExperienceTimeline({ specialist }: ExperienceTimelineProps) {
  return (
    <div className={styles.wrap}>
      {specialist.skills.map((skill) => (
        <div key={skill} className={styles.item}>
          <div className={styles.dot} />
          <div className={styles.title}>{skill}</div>
          <div className={styles.sub}>{specialist.jobTitle}</div>
        </div>
      ))}
    </div>
  )
}
