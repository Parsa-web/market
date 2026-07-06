import { Factory, X } from 'lucide-react'

export default function BrandTag({ label, onRemove }) {
  return (
    <span className="dash-brand-tag">
      <span className="dash-brand-tag-logo">
        <Factory size={15} />
      </span>
      <span className="dash-brand-tag-main">
        <strong>{label}</strong>
        <small>تجهیزات صنعتی</small>
      </span>
      {onRemove && (
        <button type="button" className="dash-tag-remove" onClick={onRemove} aria-label="حذف">
          <X size={12} />
        </button>
      )}
    </span>
  )
}
