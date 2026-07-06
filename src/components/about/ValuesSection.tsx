import { motion } from 'framer-motion'
import { Shield, Eye, Award, Wrench } from 'lucide-react'
import styles from './ValuesSection.module.css'

const iconMap: Record<string, React.ElementType> = {
  Shield, Eye, Award, Wrench,
}

interface Value {
  title: string
  description: string
  icon: string
}

interface ValuesSectionProps {
  values: Value[]
}

export default function ValuesSection({ values }: ValuesSectionProps) {
  return (
    <div className={styles.grid}>
      {values.map((value, i) => {
        const Icon = iconMap[value.icon] || Shield
        return (
          <motion.div
            key={value.title}
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className={styles.iconWrap}>
              <Icon size={22} />
            </div>
            <h3 className={styles.title}>{value.title}</h3>
            <p className={styles.desc}>{value.description}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
