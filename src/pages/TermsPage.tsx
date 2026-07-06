import { useState, useEffect } from 'react'
import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import CTASection from '../components/shared/CTASection'
import { useTerms } from '../hooks/useTerms'
import styles from './TermsPage.module.css'

export default function TermsPage() {
  const { data, loading, error } = useTerms()
  const [activeSection, setActiveSection] = useState('')
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setReadProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!data) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    data.sections.forEach((section: { id: string }) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [data])

  if (loading) return <div className={styles.app}><Header /><div className={styles.loading}>در حال بارگذاری...</div><Footer /></div>
  if (error || !data) return <div className={styles.app}><Header /><div className={styles.error}>خطا در بارگذاری اطلاعات</div><Footer /></div>

  return (
    <div className={styles.app}>
      <div className={styles.progressBar} style={{ width: `${readProgress}%` }} />

      <Header />

      <HeroSection title={data.hero.title} subtitle={`آخرین بروزرسانی: ${data.lastUpdated}`} />

      <section className={styles.section}>
        <div className={styles.layout}>
          {/* Side Nav */}
          <nav className={styles.sideNav} aria-label="فهرست بخش‌ها">
            <div className={styles.sideNavInner}>
              {data.sections.map((section: { id: string; title: string }) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`${styles.sideLink} ${activeSection === section.id ? styles.sideLinkActive : ''}`}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className={styles.content}>
            {data.sections.map((section: { id: string; title: string; content: string[] }) => (
              <div key={section.id} id={section.id} className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionContent}>
                  {section.content.map((item: string, i: number) => (
                    <p key={i} className={styles.paragraph}>{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
