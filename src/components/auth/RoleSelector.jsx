import { Check, Factory, HardHat } from 'lucide-react'

const ROLES = [
  {
    id: 'factory',
    icon: Factory,
    title: 'کارخانه یا شرکت',
    description:
      'برای پیدا کردن متخصص‌های فنی، تعمیرکاران و نیروهای متخصص تجهیزات صنعتی',
  },
  {
    id: 'specialist',
    icon: HardHat,
    title: 'متخصص فنی',
    description:
      'برای ساخت پروفایل تخصصی و نمایش تجربه کار با دستگاه‌ها و تجهیزات',
  },
]

export default function RoleSelector({ selectedRole, onSelect, disabled }) {
  return (
    <div className="rg-role-grid" role="radiogroup" aria-label="نوع حساب کاربری">
      {ROLES.map(({ id, icon: Icon, title, description }) => {
        const isSelected = selectedRole === id

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`rg-role-card${isSelected ? ' selected' : ''}`}
            onClick={() => onSelect(id)}
          >
            <span className="rg-role-check" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
            <div className="rg-role-icon">
              <Icon strokeWidth={1.5} />
            </div>
            <h3 className="rg-role-name">{title}</h3>
            <p className="rg-role-desc">{description}</p>
          </button>
        )
      })}
    </div>
  )
}
