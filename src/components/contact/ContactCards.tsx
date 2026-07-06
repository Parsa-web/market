import { Headphones, Handshake, Wrench, Info } from 'lucide-react'
import styles from './ContactCards.module.css'

const iconMap: Record<string, React.ElementType> = {
  Headphones, Handshake, Wrench, Info,
}

interface ContactCard {
  id: string
  title: string
  description: string
  icon: string
  email: string
  phone: string
  hours: string
}

interface ContactCardsProps {
  cards: ContactCard[]
}

export default function ContactCards({ cards }: ContactCardsProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const Icon = iconMap[card.icon] || Info
        return (
          <div key={card.id} className={styles.card}>
            <div className={styles.iconWrap}>
              <Icon size={22} />
            </div>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.desc}>{card.description}</p>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ایمیل:</span> {card.email}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>تلفن:</span> {card.phone}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ساعات:</span> {card.hours}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
