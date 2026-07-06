import { Cpu, Gauge, Settings2, Wrench, Zap, X } from 'lucide-react'

const SKILL_META = [
  { keywords: ['PLC', 'HMI', 'اتوماسیون'], icon: Cpu, category: 'اتوماسیون' },
  { keywords: ['برق', 'درایو', 'تابلو'], icon: Zap, category: 'برق صنعتی' },
  { keywords: ['هیدرولیک', 'پنوماتیک'], icon: Gauge, category: 'مکانیک سیالات' },
  { keywords: ['مکانیک', 'تعمیر', 'سرویس'], icon: Settings2, category: 'نگهداری' },
]

function getSkillMeta(label) {
  return SKILL_META.find((item) => item.keywords.some((keyword) => label.includes(keyword))) || {
    icon: Wrench,
    category: 'مهارت صنعتی',
  }
}

export default function SkillTag({ label, onRemove, onClick }) {
  const Tag = onClick ? 'button' : 'span'
  const meta = getSkillMeta(label)
  const Icon = meta.icon

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`dash-skill-tag${onClick ? ' dash-skill-tag--clickable' : ''}`}
      onClick={onClick}
    >
      <span className="dash-skill-tag-icon">
        <Icon size={16} />
      </span>
      <span className="dash-skill-tag-main">
        <strong>{label}</strong>
        <small>{meta.category}</small>
      </span>
      {onRemove && (
        <button type="button" className="dash-tag-remove" onClick={(e) => { e.stopPropagation(); onRemove() }} aria-label="حذف">
          <X size={12} />
        </button>
      )}
    </Tag>
  )
}
