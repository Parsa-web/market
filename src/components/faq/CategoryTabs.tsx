import styles from './CategoryTabs.module.css'

interface Category {
  id: string
  label: string
}

interface CategoryTabsProps {
  categories: Category[]
  active: string
  onChange: (id: string) => void
}

export default function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tab} ${active === '' ? styles.active : ''}`}
        onClick={() => onChange('')}
      >
        همه
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`${styles.tab} ${active === cat.id ? styles.active : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
