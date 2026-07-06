import { motion } from 'framer-motion'
import { Building2, UserCog } from 'lucide-react'
import styles from './AudienceCards.module.css'

const factoryItems = [
  'تعمیر و نگهداری ماشین‌آلات صنعتی',
  'اتوماسیون صنعتی و کنترل فرآیند',
  'PLC و سیستم‌های کنترل',
  'برق صنعتی و تابلو برق',
  'مکانیک صنعتی و هیدرولیک',
  'تعمیرات تجهیزات خط تولید',
]

const specialistItems = [
  'تکنسین‌های باتجربه تعمیرات صنعتی',
  'برنامه‌نویسان PLC و کنترلرها',
  'برقکارهای صنعتی حرفه‌ای',
  'تکنسین‌های مکانیک صنعتی',
  'مهندسان اتوماسیون و ابزاردقیق',
  'متخصصان تعمیر ماشین‌آلات',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function AudienceCards() {
  return (
    <section className={styles.section} aria-labelledby="audience-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="audience-title" className={styles.title}>این پلتفرم برای چه کسانی است؟</h2>
          <p className={styles.desc}>
            صنعت‌نت دو گروه اصلی را به هم متصل می‌کند
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div className={styles.card} variants={cardVariants}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <Building2 size={24} />
              </div>
              <h3 className={styles.cardTitle}>کارخانه‌ها و صنایع</h3>
            </div>
            <p className={styles.cardBody}>
              اگر کارخانه یا واحد صنعتی دارید و به متخصص فنی نیاز دارید، صنعت‌نت
              مناسب شماست. نیازهای خود را ثبت کنید و از بین متخصصان تأیید شده انتخاب کنید.
            </p>
            <div className={styles.list}>
              {factoryItems.map((item) => (
                <div key={item} className={styles.listItem}>
                  <div className={styles.bullet} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.card} variants={cardVariants}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <UserCog size={24} />
              </div>
              <h3 className={styles.cardTitle}>متخصصان فنی</h3>
            </div>
            <p className={styles.cardBody}>
              اگر متخصص فنی با تجربه در حوزه صنعت هستید، صنعت‌نت فرصت همکاری با
              کارخانه‌های معتبر را فراهم می‌کند. تخصص خود را ثبت کنید و پروژه مناسب پیدا کنید.
            </p>
            <div className={styles.list}>
              {specialistItems.map((item) => (
                <div key={item} className={styles.listItem}>
                  <div className={styles.bullet} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
