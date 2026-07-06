import { motion } from 'framer-motion'
import { UserPlus, FileText, UserCheck, Search, SendHorizontal, Eye } from 'lucide-react'
import TimelineStep from './TimelineStep'
import styles from './SpecialistTimeline.module.css'

const steps = [
  {
    icon: UserPlus,
    title: 'ثبت‌نام',
    desc: 'به عنوان متخصص ثبت‌نام کنید. ثبت‌نام رایگان است و اطلاعات پایه شما ثبت می‌شود.',
  },
  {
    icon: FileText,
    title: 'تکمیل پروفایل حرفه‌ای',
    desc: 'سوابق کاری، تحصیلات و مدارک فنی خود را در پروفایل ثبت کنید.',
  },
  {
    icon: UserCheck,
    title: 'افزودن مهارت‌ها و تجربیات',
    desc: 'تخصص‌های خود را اضافه کنید: PLC، برق صنعتی، مکانیک، اتوماسیون و سایر مهارت‌ها.',
  },
  {
    icon: Search,
    title: 'مشاهده درخواست‌های صنعتی',
    desc: 'نیازهای ثبت شده توسط کارخانه‌ها را مرور کنید و فرصت‌های مناسب را پیدا کنید.',
  },
  {
    icon: SendHorizontal,
    title: 'ارسال درخواست همکاری',
    desc: 'برای پروژه‌های مورد نظر خود درخواست همکاری ارسال کنید.',
  },
  {
    icon: Eye,
    title: 'پیگیری وضعیت درخواست',
    desc: 'وضعیت درخواست‌های خود را در پنل کاربری پیگیری کنید و از نتیجه مطلع شوید.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function SpecialistTimeline() {
  return (
    <section className={styles.section} aria-labelledby="specialist-timeline-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>متخصص</div>
          <h2 id="specialist-timeline-title" className={styles.title}>مراحل کار برای متخصصان</h2>
          <p className={styles.desc}>
            از ثبت‌نام تا دریافت پروژه، فرآیندی ساده و حرفه‌ای
          </p>
        </div>

        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, index) => (
            <TimelineStep
              key={step.title}
              index={index}
              icon={step.icon}
              title={step.title}
              desc={step.desc}
              variant="specialist"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
