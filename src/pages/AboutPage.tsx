import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import CTASection from '../components/shared/CTASection'
import SectionTitle from '../components/shared/SectionTitle'
import ValuesSection from '../components/about/ValuesSection'
import Timeline from '../components/about/Timeline'
import StatsSection from '../components/about/StatsSection'
import { useAbout } from '../hooks/useAbout'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const { data, loading, error } = useAbout()

  if (loading) return <div className={styles.app}><Header /><div className={styles.loading}>در حال بارگذاری...</div><Footer /></div>
  if (error || !data) return <div className={styles.app}><Header /><div className={styles.error}>خطا در بارگذاری اطلاعات</div><Footer /></div>

  return (
    <div className={styles.app}>
      <Header />

      <HeroSection title={data.hero.title} subtitle={data.hero.subtitle} />

      {/* Intro */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionTitle title={data.intro.title} />
          <div className={styles.introContent}>
            {data.intro.paragraphs.map((p: string, i: number) => (
              <p key={i} className={styles.introText}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <h3 className={styles.mvTitle}>{data.mission.title}</h3>
              <p className={styles.mvDesc}>{data.mission.description}</p>
            </div>
            <div className={styles.mvCard}>
              <h3 className={styles.mvTitle}>{data.vision.title}</h3>
              <p className={styles.mvDesc}>{data.vision.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionTitle title="ارزش‌های ما" subtitle="اصلی‌ترین ارزش‌هایی که در تمام فعالیت‌های ما نقش دارند" />
          <ValuesSection values={data.values} />
        </div>
      </section>

      {/* Advantages */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.container}>
          <SectionTitle title="مزایای صنعت‌نت" subtitle="چرا صنعت‌نت بهترین انتخاب برای نیازهای صنعتی شماست" />
          <div className={styles.advGrid}>
            {data.advantages.map((adv: { title: string; description: string }, i: number) => (
              <div key={i} className={styles.advCard}>
                <h4 className={styles.advTitle}>{adv.title}</h4>
                <p className={styles.advDesc}>{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionTitle title="نحوه کار صنعت‌نت" subtitle="از ثبت‌نام تا تکمیل پروژه، مراحل کار به صورت زیر انجام می‌شود" />
          <div className={styles.timelineWrap}>
            <Timeline steps={data.timeline} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.container}>
          <SectionTitle title="آمار صنعت‌نت" />
          <StatsSection stats={data.stats} />
        </div>
      </section>

      <CTASection
        title={data.cta.title}
        subtitle={data.cta.subtitle}
        factoryBtn={data.cta.factoryBtn}
        specialistBtn={data.cta.specialistBtn}
      />

      <Footer />
    </div>
  )
}
