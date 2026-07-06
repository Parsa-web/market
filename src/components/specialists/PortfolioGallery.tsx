import type { PortfolioItem } from './types'
import styles from './PortfolioGallery.module.css'

interface PortfolioGalleryProps {
  items: PortfolioItem[]
}

export default function PortfolioGallery({ items }: PortfolioGalleryProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.title} className={styles.item}>
          <div className={styles.itemTitle}>{item.title}</div>
          <div className={styles.itemDesc}>{item.description}</div>
        </div>
      ))}
    </div>
  )
}
