import { Search, X } from 'lucide-react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.wrap}>
      <input
        type="text"
        className={styles.input}
        placeholder="جستجو بر اساس دستگاه، برند، مهارت، صنعت، شهر..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="جستجوی درخواست‌های صنعتی"
      />
      <Search size={18} className={styles.icon} />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange('')}
          aria-label="پاک کردن جستجو"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
