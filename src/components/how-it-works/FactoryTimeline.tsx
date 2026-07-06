import { motion } from 'framer-motion'
import { Building2, FileText, ClipboardList, Search, UserCheck, MessageCircle } from 'lucide-react'
import TimelineStep from './TimelineStep'
import styles from './FactoryTimeline.module.css'

const steps = [
  {
    icon: Building2,
    title: 'ثبت‌نام',
    desc: 'کارخانه در صنعت‌نت ثبت‌نام می‌کند. ثبت‌نام رایگان است و فقط چند دقیقه زمان می‌برد.',
  },
  {
    icon: FileText,
    title: 'تکمیل پروفایل شرکت',
    desc: 'اطلاعات شرکت، زمینه فعالیت و نیازهای عمومی خود را در پروفایل ثبت کنید.',
  },
  {
    icon: ClipboardList,
    title: 'ایجاد درخواست صنعتی',
    desc: 'نیاز خود را با جزئیات کامل ثبت کنید: نوع تخصص، مدت زمان، محل پروژه و توضیحات فنی.',
  },
  {
    icon: Search,
    title: 'دریافت درخواست متخصصان',
    desc: 'متخصصان واجد شرایط درخواست همکاری ارسال می‌کنند و شما پیشنهادات را بررسی می‌کنید.',
  },
  {
    icon: UserCheck,
    title: 'بررسی متقاضیان',
    desc: 'سوابق، مهارت‌ها و تجربیات متقاضیان را مرور کرده و با آنها گفتگو کنید.',
  },
  {
    icon: MessageCircle,
    title: 'انتخاب متخصص مناسب',
    desc: 'بهترین متخصص را انتخاب کرده و همکاری را شروع کنید. همه چیز در پلتفرم مدیریت می‌شود.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function FactoryTimeline() {
  return (
    <section className={styles.section} aria-labelledby="factory-timeline-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>کارخانه</div>
          <h2 id="factory-timeline-title" className={styles.title}>مراحل کار برای کارخانه‌ها</h2>
          <p className={styles.desc}>
            از ثبت‌نام تا انتخاب متخصص مناسب، تمام مراحل ساده و شفاف است
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
              variant="factory"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
