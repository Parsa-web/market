import { User, Mail, MapPin, Building, Phone, Briefcase } from 'lucide-react'

const fields = [
  { name: 'companyName', label: 'نام شرکت', type: 'text', icon: Building, placeholder: 'مثال: شرکت صنایع فولاد مبارکه' },
  { name: 'managerName', label: 'نام مسئول', type: 'text', icon: User, placeholder: 'مثال: مهندس احمد محمدی' },
  { name: 'phone', label: 'شماره موبایل', type: 'tel', icon: Phone, placeholder: '۰۹۱۲۳۴۵۶۷۸۹' },
  { name: 'email', label: 'ایمیل (اختیاری)', type: 'email', icon: Mail, placeholder: 'info@company.ir' },
  { name: 'city', label: 'شهر', type: 'text', icon: MapPin, placeholder: 'مثال: اصفهان' },
  { name: 'industry', label: 'نوع صنعت', type: 'text', icon: Briefcase, placeholder: 'مثال: فولاد، نفت، گاز، پتروشیمی' },
]

export default function FactoryForm({ onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        {fields.map((field) => (
          <div key={field.name} className="form-field">
            <label htmlFor={field.name} className="form-label">
              <field.icon className="form-icon" size={18} strokeWidth={2} />
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className="form-input"
              required={!field.label.includes('اختیاری')}
              autoComplete="off"
            />
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit-btn">
        ایجاد حساب کارخانه
      </button>
    </form>
  )
}