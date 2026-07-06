import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'جستجو...', className = '' }) {
  return (
    <div className={`dash-search ${className}`}>
      <Search size={18} className="dash-search-icon" />
      <input
        type="search"
        className="dash-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
