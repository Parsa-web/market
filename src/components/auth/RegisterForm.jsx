import {
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Cpu,
  GraduationCap,
  Lock,
  MapPin,
  Package,
  Phone,
  Tag,
  User,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import { getSpecialtyPlaceholder, specialtyTitles } from '../../data/specialties'
import { useAuth } from '../../hooks/useAuth'

function FactoryForm({ onBack, onSuccess }) {
  const { register } = useAuth()
  const [data, setData] = useState({
    company: '',
    manager: '',
    phone: '',
    industry: '',
    city: '',
    lines: '',
    equipment: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    const v = data // alias

    if (!v.company.trim()) nextErrors.company = 'نام کارخانه الزامی است'
    else if (v.company.trim().length < 3) nextErrors.company = 'نام کارخانه باید حداقل ۳ حرف باشد'

    if (!v.manager.trim()) nextErrors.manager = 'نام مسئول فنی الزامی است'
    else if (v.manager.trim().length < 3) nextErrors.manager = 'نام باید حداقل ۳ حرف باشد'

    if (!v.phone.trim()) nextErrors.phone = 'شماره تماس الزامی است'
    else if (!/^09\d{9}$/.test(v.phone.trim())) nextErrors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'

    if (!v.industry.trim()) nextErrors.industry = 'صنعت الزامی است'
    if (!v.city.trim()) nextErrors.city = 'شهر الزامی است'

    if (!v.password) nextErrors.password = 'رمز عبور الزامی است'
    else if (v.password.length < 6) nextErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await register({ ...data, identifier: data.phone, role: 'factory' })
      onSuccess()
    } catch (err) {
      setErrors({ phone: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="rg-form-header">
        <button type="button" className="rg-form-back" onClick={onBack}>
          <ChevronRight size={16} />
          بازگشت به انتخاب نقش
        </button>
        <span className="rg-step-badge">مرحله ۲ از ۲</span>
      </div>
      <h2 className="rg-form-title">اطلاعات کارخانه</h2>
      <p className="rg-form-subtitle">اطلاعات اولیه کارخانه یا شرکت خود را وارد کنید</p>

      <form onSubmit={handleSubmit}>
        <div className="rg-form-grid">
          <Input
            label="نام کارخانه"
            placeholder="نام شرکت یا کارخانه"
            icon={Building2}
            required
            fullWidth
            value={data.company}
            error={errors.company}
            onChange={(event) => update('company', event.target.value)}
          />
          <Input
            label="نام مسئول فنی"
            placeholder="نام و نام خانوادگی"
            icon={User}
            required
            value={data.manager}
            error={errors.manager}
            onChange={(event) => update('manager', event.target.value)}
          />
          <Input
            label="شماره تماس"
            placeholder="۰۹۱۲xxxxxxx"
            icon={Phone}
            required
            value={data.phone}
            error={errors.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
          <Input
            label="صنعت"
            placeholder="نوع صنعت"
            icon={Briefcase}
            required
            value={data.industry}
            error={errors.industry}
            onChange={(event) => update('industry', event.target.value)}
          />
          <Input
            label="شهر"
            placeholder="شهر محل فعالیت"
            icon={MapPin}
            required
            value={data.city}
            error={errors.city}
            onChange={(event) => update('city', event.target.value)}
          />
          <Input
            label="رمز عبور"
            placeholder="حداقل ۶ کاراکتر"
            type="password"
            icon={Lock}
            required
            value={data.password}
            error={errors.password}
            onChange={(event) => update('password', event.target.value)}
          />
        </div>

        <div className="rg-form-section">
          <h3 className="rg-form-section-title">اطلاعات تکمیلی</h3>
          <p className="rg-form-section-hint">اختیاری — برای تطبیق بهتر با متخصصان</p>
          <div className="rg-form-grid">
            <Input
              label="تعداد خطوط تولید"
              placeholder="مثال: ۵ خط"
              icon={Package}
              value={data.lines}
              onChange={(event) => update('lines', event.target.value)}
            />
            <Input
              label="دستگاه‌های اصلی"
              placeholder="مثال: CNC، توربین"
              icon={Cpu}
              value={data.equipment}
              onChange={(event) => update('equipment', event.target.value)}
            />
          </div>
        </div>

        <div className="auth-submit" style={{ marginTop: 32 }}>
          <Button type="submit" auth loading={isSubmitting} loadingText="در حال ثبت...">
            ادامه ثبت نام
          </Button>
        </div>
      </form>
    </>
  )
}

function SpecialistForm({ onBack, onSuccess }) {
  const { register } = useAuth()
  const [data, setData] = useState({
    fullName: '',
    phone: '',
    specialty: '',
    experience: '',
    city: '',
    devices: '',
    brands: '',
    skills: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    const v = data

    if (!v.fullName.trim()) nextErrors.fullName = 'نام و نام خانوادگی الزامی است'
    else if (v.fullName.trim().length < 3) nextErrors.fullName = 'نام باید حداقل ۳ حرف باشد'

    if (!v.phone.trim()) nextErrors.phone = 'شماره تماس الزامی است'
    else if (!/^09\d{9}$/.test(v.phone.trim())) nextErrors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'

    if (!v.specialty.trim()) nextErrors.specialty = 'تخصص اصلی الزامی است'
    if (!v.experience.trim()) nextErrors.experience = 'سال تجربه الزامی است'
    else if (!/^\d+$/.test(v.experience.trim())) nextErrors.experience = 'سال تجربه باید عدد باشد'

    if (!v.city.trim()) nextErrors.city = 'شهر الزامی است'

    if (!v.password) nextErrors.password = 'رمز عبور الزامی است'
    else if (v.password.length < 6) nextErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await register({ ...data, identifier: data.phone, role: 'specialist' })
      onSuccess()
    } catch (err) {
      setErrors({ phone: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="rg-form-header">
        <button type="button" className="rg-form-back" onClick={onBack}>
          <ChevronRight size={16} />
          بازگشت به انتخاب نقش
        </button>
        <span className="rg-step-badge">مرحله ۲ از ۲</span>
      </div>
      <h2 className="rg-form-title">اطلاعات تخصصی</h2>
      <p className="rg-form-subtitle">پروفایل حرفه‌ای خود را برای کارخانه‌ها بسازید</p>

      <form onSubmit={handleSubmit}>
        <div className="rg-form-grid">
          <Input
            label="نام و نام خانوادگی"
            placeholder="نام و نام خانوادگی"
            icon={User}
            required
            fullWidth
            value={data.fullName}
            error={errors.fullName}
            onChange={(event) => update('fullName', event.target.value)}
          />
          <Input
            label="شماره تماس"
            placeholder="۰۹۱۲xxxxxxx"
            icon={Phone}
            required
            value={data.phone}
            error={errors.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
          <Input
            label="تخصص اصلی"
            placeholder={getSpecialtyPlaceholder()}
            icon={GraduationCap}
            required
            value={data.specialty}
            error={errors.specialty}
            onChange={(event) => update('specialty', event.target.value)}
            list="specialty-suggestions"
          />
          <datalist id="specialty-suggestions">
            {specialtyTitles.map((title) => (
              <option key={title} value={title} />
            ))}
          </datalist>
          <Input
            label="سال تجربه"
            placeholder="مثال: ۸ سال"
            icon={Briefcase}
            required
            value={data.experience}
            error={errors.experience}
            onChange={(event) => update('experience', event.target.value)}
          />
          <Input
            label="شهر"
            placeholder="شهر محل سکونت"
            icon={MapPin}
            required
            value={data.city}
            error={errors.city}
            onChange={(event) => update('city', event.target.value)}
          />
          <Input
            label="رمز عبور"
            placeholder="حداقل ۶ کاراکتر"
            type="password"
            icon={Lock}
            required
            value={data.password}
            error={errors.password}
            onChange={(event) => update('password', event.target.value)}
          />
        </div>

        <div className="rg-form-section">
          <h3 className="rg-form-section-title">اطلاعات حرفه‌ای</h3>
          <p className="rg-form-section-hint">اختیاری — برای نمایش تخصص دقیق‌تر در پروفایل</p>
          <div className="rg-form-grid">
            <Input
              label="مهارت‌های فنی"
              placeholder="مثال: PLC، برق صنعتی، اتوماسیون"
              icon={Wrench}
              fullWidth
              value={data.skills}
              onChange={(event) => update('skills', event.target.value)}
            />
            <Input
              label="دستگاه‌هایی که تجربه کار با آنها را دارید"
              placeholder="مثال: CNC، تراش، PLC"
              icon={Cpu}
              fullWidth
              value={data.devices}
              onChange={(event) => update('devices', event.target.value)}
            />
            <Input
              label="برندهایی که می‌شناسید"
              placeholder="مثال: Siemens، ABB"
              icon={Tag}
              fullWidth
              value={data.brands}
              onChange={(event) => update('brands', event.target.value)}
            />
          </div>
        </div>

        <div className="auth-submit" style={{ marginTop: 32 }}>
          <Button type="submit" auth loading={isSubmitting} loadingText="در حال ثبت...">
            ساخت پروفایل
          </Button>
        </div>
      </form>
    </>
  )
}

function SuccessView({ role }) {
  const dashboardPath = role === 'factory' ? '/factory' : '/specialist'
  return (
    <div className="rg-success">
      <div className="rg-success-icon">
        <Check />
      </div>
      <h2 className="rg-success-title">
        {role === 'factory' ? 'حساب کارخانه با موفقیت ساخته شد' : 'پروفایل متخصص با موفقیت ساخته شد'}
      </h2>
      <p className="rg-success-text">
        {role === 'factory'
          ? 'اطلاعات شما ثبت شد. اکنون می‌توانید از داشبورد کارخانه استفاده کنید.'
          : 'اطلاعات شما ثبت شد. اکنون می‌توانید از داشبورد متخصص استفاده کنید.'}
      </p>
      <Link to={dashboardPath} className="auth-btn auth-btn-primary">
        ورود به داشبورد
      </Link>
    </div>
  )
}

export default function RegisterForm({ step, role, onBack, onSuccess }) {
  if (step === 'form' && role === 'factory') {
    return (
      <div className="rg-step rg-step--form">
        <FactoryForm onBack={onBack} onSuccess={onSuccess} />
      </div>
    )
  }

  if (step === 'form' && role === 'specialist') {
    return (
      <div className="rg-step rg-step--form">
        <SpecialistForm onBack={onBack} onSuccess={onSuccess} />
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="rg-step">
        <SuccessView role={role} />
      </div>
    )
  }

  return null
}
