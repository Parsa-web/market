import { Database, Settings, Cookie, Lock, Shield, ExternalLink, UserCheck, HardDrive, Mail } from 'lucide-react'
import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import { usePrivacy } from '../hooks/usePrivacy'
import styles from './PrivacyPage.module.css'

const iconMap: Record<string, React.ElementType> = {
  Database, Settings, Cookie, Lock, Shield, ExternalLink, UserCheck, HardDrive, Mail,
}

export default function PrivacyPage() {
  const { data } = usePrivacy()

  return (
    <div className={styles.app}>
      <Header />

      <HeroSection title={data.hero.title} subtitle={`آخرین بروزرسانی: ${data.lastUpdated}`} />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {data.sections.map((section: { id: string; title: string; icon: string; items: string[] }) => {
              const Icon = iconMap[section.icon] || Shield
              return (
                <div key={section.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrap}>
                      <Icon size={20} />
                    </div>
                    <h3 className={styles.cardTitle}>{section.title}</h3>
                  </div>
                  <ul className={styles.cardList}>
                    {section.items.map((item: string, i: number) => (
                      <li key={i} className={styles.cardItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
