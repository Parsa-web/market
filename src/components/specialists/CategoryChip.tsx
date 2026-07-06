import styles from './CategoryChip.module.css'

interface CategoryChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export default function CategoryChip({ label, active, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
