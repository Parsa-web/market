import { motion } from 'framer-motion'
import { Target, Shield, ClipboardList, MessageSquare, GitPullRequest, Eye } from 'lucide-react'
import styles from './BenefitsSection.module.css'

const benefits = [
  {
    icon: Target,
    title: 'پلتفرم تخصصی صنعتی',
    desc: 'برخلاف پلتفرم‌های عمومی، صنعت‌نت کاملاً متمرکز بر نیازهای صنعتی و فنی است.',
  },
  {
    icon: Shield,
    title: 'پروفایل‌های تأیید شده',
    desc: 'مهارت‌ها و سوابق متخصصان بررسی و تأیید می‌شود تا کیفیت همکاری تضمین شود.',
  },
  {
    icon: ClipboardList,
    title: 'مدیریت ساده درخواست‌ها',
    desc: 'ثبت، پیگیری و مدیریت نیازهای صنعتی در یک داشبورد کاربردی.',
  },
  {
    icon: MessageSquare,
    title: 'ارتباط سریع و مستقیم',
    desc: 'سیستم پیام‌رسان داخلی امکان گفتگوی مستقیم بین کارخانه و متخصص را فراهم می‌کند.',
  },
  {
    icon: GitPullRequest,
    title: 'تطبیق دقیق صنعتی',
    desc: 'نیازهای کارخانه با تخصص و تجربه متخصصان تطبیق داده می‌شود.',
  },
  {
    icon: Eye,
    title: 'پیگیری آسان درخواست‌ها',
    desc: 'وضعیت درخواست‌ها و همکاری‌ها را در هر لحظه در پنل کاربری خود مشاهده کنید.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function BenefitsSection() {
  return (
    <section className={styles.section} aria-labelledby="benefits-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="benefits-title" className={styles.title}>چرا صنعت‌نت؟</h2>
          <p className={styles.desc}>
            مزایای استفاده از پلتفرم تخصصی اتصال صنایع و متخصصان
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {benefits.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} className={styles.card} variants={cardVariants}>
                <div className={styles.iconWrap}>
                  <Icon size={22} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
