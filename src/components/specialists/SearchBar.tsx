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
        placeholder="جستجوی نام، مهارت، دستگاه، برند یا شهر..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="جستجوی متخصصان"
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
