import { Search, X } from 'lucide-react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder = 'جستجو...' }: SearchInputProps) {
  return (
    <div className={styles.wrap}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="جستجو"
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
