import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import { specialtySelectOptions } from '../../data/specialties'
import { useFactory } from '../../hooks/useFactory'

const PRIORITY_OPTIONS = ['پایین', 'متوسط', 'بالا', 'فوری']

export default function NewRequestPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { addRequest, updateRequest, requests } = useFactory()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    industry: '',
    machine: '',
    brand: '',
    skillsRequired: '',
    experienceLevel: '',
    location: '',
    budget: '',
    requiredTime: '',
    priority: 'متوسط',
  })

  useEffect(() => {
    if (isEdit && requests && requests.length > 0) {
      const existing = requests.find((r) => r.id === Number(id))
      if (existing) {
        setForm({
          title: existing.title || '',
          description: existing.description || '',
          industry: existing.industry || '',
          machine: existing.machine || '',
          brand: existing.brand || '',
          skillsRequired: Array.isArray(existing.skillsRequired) ? existing.skillsRequired.join('، ') : (existing.skillsRequired || ''),
          experienceLevel: existing.experienceLevel || '',
          location: existing.location || '',
          budget: existing.budget || '',
          requiredTime: existing.requiredTime || '',
          priority: existing.priority || 'متوسط',
        })
      }
    }
  }, [id, isEdit, requests])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'عنوان نیاز الزامی است'
    if (!form.description.trim()) next.description = 'توضیحات الزامی است'
    if (!form.industry) next.industry = 'صنعت الزامی است'
    if (!form.machine.trim()) next.machine = 'دستگاه الزامی است'
    if (!form.brand.trim()) next.brand = 'برند الزامی است'
    if (!form.location.trim()) next.location = 'محل الزامی است'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    const requestData = {
      title: form.title,
      description: form.description,
      industry: form.industry,
      machine: form.machine,
      brand: form.brand,
      skillsRequired: form.skillsRequired.split('،').map(s => s.trim()).filter(Boolean),
      experienceLevel: form.experienceLevel,
      location: form.location,
      budget: form.budget,
      requiredTime: form.requiredTime,
      priority: form.priority,
      status: 'published',
    }

    try {
      if (isEdit) {
        await updateRequest(Number(id), requestData)
      } else {
        await addRequest(requestData)
      }
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/factory/requests'), 1500)
    } catch (err) {
      setLoading(false)
      setErrors({ form: err.message || 'خطا در ثبت نیاز. لطفاً دوباره تلاش کنید.' })
    }
  }

  if (success) {
    return (
      <div className="dash-page">
        <div className="dash-success-state">
          <div className="dash-success-icon">✓</div>
          <h2>{isEdit ? 'نیاز صنعتی با موفقیت ویرایش شد' : 'نیاز صنعتی با موفقیت ثبت شد'}</h2>
          <p>در حال انتقال به لیست نیازها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div className="dash-form-card">
        <h2 className="dash-form-title">{isEdit ? 'ویرایش نیاز صنعتی' : 'ثبت نیاز صنعتی جدید'}</h2>
        <p className="dash-form-subtitle">
          اطلاعات نیاز فنی کارخانه را تکمیل کنید تا متخصصان بتوانند درخواست همکاری ارسال کنند.
        </p>

        <form onSubmit={handleSubmit} className="dash-form">
          {errors.form && <div style={{ padding: '12px 16px', background: '#FEF2F2', color: '#DC2626', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16, border: '1px solid #FECACA' }}>{errors.form}</div>}
          <Input
            label="عنوان نیاز"
            required
            value={form.title}
            error={errors.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="مثال: عیب‌یابی PLC خط تولید"
            fullWidth
          />

          <div className="auth-field rg-full">
            <label className="auth-field-label">توضیحات کامل <span className="rg-required">*</span></label>
            <textarea
              className={`dash-textarea${errors.description ? ' has-error' : ''}`}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="شرح کامل مشکل، شرایط کار و انتظارات..."
              rows={4}
            />
            {errors.description && <p className="auth-error-text">{errors.description}</p>}
          </div>

          <div className="dash-form-grid">
            <Select
              label="صنعت"
              required
              value={form.industry}
              error={errors.industry}
              onChange={(value) => update('industry', value)}
              options={[
                { value: '', label: 'انتخاب کنید' },
                ...specialtySelectOptions.slice(1).map(item => ({ value: item.value, label: item.label })),
              ]}
            />

            <Input
              label="دستگاه"
              required
              value={form.machine}
              error={errors.machine}
              onChange={(e) => update('machine', e.target.value)}
              placeholder="نام دستگاه صنعتی"
            />

            <Input
              label="برند دستگاه"
              required
              value={form.brand}
              error={errors.brand}
              onChange={(e) => update('brand', e.target.value)}
              placeholder="مثال: Siemens, ABB"
            />

            <Input
              label="محل انجام کار"
              required
              value={form.location}
              error={errors.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="شهر یا استان"
            />

            <Input
              label="بودجه پیشنهادی (تومان)"
              type="text"
              inputMode="numeric"
              value={form.budget.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={(e) => update('budget', e.target.value.replace(/,/g, ''))}
              placeholder="مبلغ به تومان"
            />

            <Input
              label="مدت زمان مورد نیاز"
              value={form.requiredTime}
              onChange={(e) => update('requiredTime', e.target.value)}
              placeholder="مثال: ۲ هفته"
            />

            <Select
              label="سابقه مورد نیاز"
              value={form.experienceLevel}
              onChange={(value) => update('experienceLevel', value)}
              options={[
                { value: '', label: 'انتخاب کنید' },
                { value: 'کمتر از ۳ سال', label: 'کمتر از ۳ سال' },
                { value: 'بیش از ۳ سال', label: 'بیش از ۳ سال' },
                { value: 'بیش از ۵ سال', label: 'بیش از ۵ سال' },
                { value: 'بیش از ۸ سال', label: 'بیش از ۸ سال' },
              ]}
            />

            <Select
              label="اولویت"
              value={form.priority}
              onChange={(value) => update('priority', value)}
              options={PRIORITY_OPTIONS.map(p => ({ value: p, label: p }))}
            />
          </div>

          <Input
            label="مهارت‌های مورد نیاز"
            value={form.skillsRequired}
            onChange={(e) => update('skillsRequired', e.target.value)}
            placeholder="PLC، هیدرولیک، اینورتر (با کاما جدا کنید)"
            fullWidth
          />

          <div className="dash-form-actions">
            <Button type="button" variant="outline" onClick={() => navigate('/factory/requests')}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" loading={loading} loadingText={isEdit ? 'در حال ذخیره...' : 'در حال ثبت...'}>
              {isEdit ? 'ذخیره تغییرات' : 'ثبت نیاز صنعتی'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
