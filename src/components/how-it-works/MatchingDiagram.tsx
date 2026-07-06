import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import styles from './MatchingDiagram.module.css'

const steps = [
  'کارخانه نیاز صنعتی خود را ثبت می‌کند',
  'سیستم نیاز را دسته‌بندی می‌کند',
  'متخصصان نیازهای مرتبط را مشاهده می‌کنند',
  'متخصصان درخواست همکاری ارسال می‌کنند',
  'کارخانه درخواست‌ها را بررسی می‌کند',
  'ارتباط بین کارخانه و متخصص آغاز می‌شود',
  'همکاری حرفه‌ای شروع می‌شود',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function MatchingDiagram() {
  return (
    <section className={styles.section} aria-labelledby="matching-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="matching-title" className={styles.title}>فرآیند تطبیق هوشمند</h2>
          <p className={styles.desc}>
            چگونه نیازهای صنعتی به متخصصان مناسب متصل می‌شود
          </p>
        </div>

        <motion.div
          className={styles.flow}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {steps.map((text, index) => (
            <div key={text}>
              <motion.div className={styles.step} variants={stepVariants}>
                <div className={styles.stepIndex}>{index + 1}</div>
                <div className={styles.stepText}>{text}</div>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className={styles.arrow}
                  variants={stepVariants}
                >
                  <ArrowDown size={16} />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
