import {
  Apple,
  Briefcase,
  Building2,
  Car,
  Check,
  ChevronRight,
  Droplets,
  Flame,
  GraduationCap,
  HardHat,
  Lock,
  Mail,
  MapPin,
  MoreHorizontal,
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
import Select from '../common/Select'
import { useAuth } from '../../hooks/useAuth'
import { specialtySelectOptions } from '../../data/specialties'

function FactoryForm({ onBack, onSuccess }) {
  const { register } = useAuth()
  const [data, setData] = useState({
    companyName: '',
    phone: '',
    email: '',
    industry: '',
    city: '',
    province: '',
    description: '',
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

    if (!v.companyName.trim()) nextErrors.companyName = 'نام کارخانه الزامی است'
    else if (v.companyName.trim().length < 3) nextErrors.companyName = 'نام کارخانه باید حداقل ۳ حرف باشد'

    if (!v.phone.trim()) nextErrors.phone = 'شماره تماس الزامی است'
    else if (!/^09\d{9}$/.test(v.phone.trim())) nextErrors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'

    if (!v.email.trim()) nextErrors.email = 'ایمیل الزامی است'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) nextErrors.email = 'فرمت ایمیل معتبر نیست'

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
      setErrors({ form: err.message })
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
            value={data.companyName}
            error={errors.companyName}
            onChange={(event) => update('companyName', event.target.value)}
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
            label="ایمیل"
            placeholder="example@email.com"
            icon={Mail}
            required
            type="email"
            value={data.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
          />
          <Select
            label="صنعت"
            required
            icon={Building2}
            value={data.industry}
            error={errors.industry}
            onChange={(value) => update('industry', value)}
            placeholder="انتخاب صنعت"
            options={[
              { value: '', label: 'انتخاب صنعت', description: 'زمینه فعالیت کارخانه را انتخاب کنید', icon: Building2 },
              { value: 'فولاد و ذوب فلزات', label: 'فولاد و ذوب فلزات', description: 'نورد، ذوب، ریخته‌گری و آلیاژها', icon: Flame },
              { value: 'پتروشیمی و نفت و گاز', label: 'پتروشیمی و نفت و گاز', description: 'پالایش، پلیمر، شیمیایی و گاز', icon: Droplets },
              { value: 'سیمان و مصالح ساختمانی', label: 'سیمان و مصالح ساختمانی', description: 'سیمان، گچ، آجر و معادن', icon: HardHat },
              { value: 'صنایع غذایی', label: 'صنایع غذایی', description: 'تولید مواد غذایی و بسته‌بندی', icon: Apple },
              { value: 'قطعات خودرو و ماشین‌آلات', label: 'قطعات خودرو و ماشین‌آلات', description: 'ساخت قطعات، مونتاژ و بدنه', icon: Car },
              { value: 'سایر', label: 'سایر', description: 'سایر صنایع تولیدی و خدماتی', icon: MoreHorizontal },
            ]}
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
            label="استان"
            placeholder="استان"
            icon={MapPin}
            value={data.province}
            onChange={(event) => update('province', event.target.value)}
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
              label="توضیحات کارخانه"
              placeholder="توضیحات درباره فعالیت‌ها و تجهیزات"
              icon={Package}
              fullWidth
              value={data.description}
              onChange={(event) => update('description', event.target.value)}
            />
          </div>
        </div>

        {errors.form && <p className="auth-error-text auth-error-text--form">{errors.form}</p>}

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
    email: '',
    specialty: '',
    experience: '',
    city: '',
    skills: '',
    brands: '',
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

    if (!v.email.trim()) nextErrors.email = 'ایمیل الزامی است'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) nextErrors.email = 'فرمت ایمیل معتبر نیست'

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
      await register({
        ...data,
        identifier: data.phone,
        role: 'specialist',
        skills: typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        brands: typeof data.brands === 'string' ? data.brands.split(',').map(s => s.trim()).filter(Boolean) : [],
        experience: parseInt(data.experience, 10),
      })
      onSuccess()
    } catch (err) {
      setErrors({ form: err.message })
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
            label="ایمیل"
            placeholder="example@email.com"
            icon={Mail}
            required
            type="email"
            value={data.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
          />
            <Select
              label="تخصص اصلی"
              icon={Wrench}
              required
              value={data.specialty}
              error={errors.specialty}
              onChange={(value) => update('specialty', value)}
              options={specialtySelectOptions}
              placeholder="انتخاب تخصص اصلی"
            />
          <Input
            label="سال تجربه"
            placeholder="مثال: ۵"
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
              label="مهارت‌های فنی (با کاما جدا کنید)"
              placeholder="مثال: PLC، برق صنعتی، اتوماسیون"
              icon={Wrench}
              fullWidth
              value={data.skills}
              onChange={(event) => update('skills', event.target.value)}
            />
            <Input
              label="برندهایی که می‌شناسید (با کاما جدا کنید)"
              placeholder="مثال: Siemens، ABB"
              icon={Tag}
              fullWidth
              value={data.brands}
              onChange={(event) => update('brands', event.target.value)}
            />
          </div>
        </div>

        {errors.form && <p className="auth-error-text auth-error-text--form">{errors.form}</p>}

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