import { User, Mail, MapPin, Briefcase, Phone, Award } from 'lucide-react'
import { specialtySelectOptions } from '../../data/specialties'

const fields = [
  { name: 'fullName', label: 'نام و نام خانوادگی', type: 'text', icon: User, placeholder: 'مثال: محمد رضایی' },
  { name: 'phone', label: 'شماره موبایل', type: 'tel', icon: Phone, placeholder: '۰۹۱۲۳۴۵۶۷۸۹' },
  { name: 'email', label: 'ایمیل (اختیاری)', type: 'email', icon: Mail, placeholder: 'm.rezaei@email.com' },
  { name: 'city', label: 'شهر', type: 'text', icon: MapPin, placeholder: 'مثال: تهران' },
  { name: 'specialty', label: 'تخصص اصلی', icon: Briefcase, options: specialtySelectOptions },
  { name: 'experience', label: 'سال تجربه', type: 'number', icon: Award, placeholder: 'مثال: ۱۰', min: '0', max: '50' },
]

export default function SpecialistForm({ onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        {fields.map((field) => (
          <div key={field.name} className="form-field">
            <label htmlFor={field.name} className="form-label">
              <field.icon className="form-icon" size={18} strokeWidth={2} />
              {field.label}
            </label>
            {field.options ? (
              <select
                id={field.name}
                name={field.name}
                className="form-input"
                required
                autoComplete="off"
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="form-input"
                required={!field.label.includes('اختیاری')}
                min={field.min}
                max={field.max}
                autoComplete="off"
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit-btn">
        ایجاد پروفایل متخصص
      </button>
    </form>
  )
}