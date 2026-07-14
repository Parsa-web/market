import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import SectionTitle from '../components/shared/SectionTitle'
import ContactCards from '../components/contact/ContactCards'
import ContactForm from '../components/contact/ContactForm'
import CompanyInfo from '../components/contact/CompanyInfo'
import { useContact } from '../hooks/useContact'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { data } = useContact()

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

      <Footer />
    </div>
  )
}
