import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import CTASection from '../components/shared/CTASection'
import SectionTitle from '../components/shared/SectionTitle'
import ContactCards from '../components/contact/ContactCards'
import ContactForm from '../components/contact/ContactForm'
import CompanyInfo from '../components/contact/CompanyInfo'
import { useContact } from '../hooks/useContact'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { data, loading, error } = useContact()

  if (loading) return <div className={styles.app}><Header /><div className={styles.loading}>در حال بارگذاری...</div><Footer /></div>
  if (error || !data) return <div className={styles.app}><Header /><div className={styles.error}>خطا در بارگذاری اطلاعات</div><Footer /></div>

  return (
    <div className={styles.app}>
      <Header />

      <HeroSection title={data.hero.title} subtitle={data.hero.subtitle} />

      {/* Contact Cards */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionTitle title="راه‌های ارتباطی" subtitle="از طریق روش‌های زیر با ما در تماس باشید" />
          <ContactCards cards={data.contactCards} />
        </div>
      </section>

      {/* Contact Form + Company Info */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.container}>
          <div className={styles.formLayout}>
            <ContactForm form={data.form} />
            <CompanyInfo company={data.companyInfo} />
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
