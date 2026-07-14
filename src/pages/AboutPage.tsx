import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import SectionTitle from '../components/shared/SectionTitle'
import ValuesSection from '../components/about/ValuesSection'

import StatsSection from '../components/about/StatsSection'
import { useAbout } from '../hooks/useAbout'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const { data } = useAbout()

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

      {/* Stats */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.container}>
          <SectionTitle title="آمار صنعت‌نت" />
          <StatsSection stats={data.stats} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
