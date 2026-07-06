import { Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { getSpecialtyExample, getSpecialtyPlaceholder, specialtySelectOptions } from '../../data/specialties'
import { useFactory } from '../../hooks/useFactory'

const COLLABORATION_TYPES = ['حضوری', 'دورکاری', 'ترکیبی']
const URGENCY_OPTIONS = ['عادی', 'فوری', 'بحرانی']

export default function NewRequestPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { addRequest, updateRequest, requests } = useFactory()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState({ image: null, pdf: null })
  const [form, setForm] = useState({
    title: '',
    description: '',
    specialty: '',
    equipment: '',
    brand: '',
    collaborationType: 'حضوری',
    city: '',
    experienceRequired: '',
    urgency: 'عادی',
  })

  useEffect(() => {
    if (isEdit && requests.length > 0) {
      const existing = requests.find((r) => r.id === Number(id))
      if (existing) {
        setForm({
          title: existing.title || '',
          description: existing.description || '',
          specialty: existing.specialty || '',
          equipment: existing.equipment || '',
          brand: existing.brand || '',
          collaborationType: existing.collaborationType || 'حضوری',
          city: existing.city || '',
          experienceRequired: existing.experienceRequired || '',
          urgency: existing.urgency || 'عادی',
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
    if (!form.specialty) next.specialty = 'تخصص الزامی است'
    if (!form.equipment.trim()) next.equipment = 'دستگاه الزامی است'
    if (!form.brand.trim()) next.brand = 'برند الزامی است'
    if (!form.city.trim()) next.city = 'شهر الزامی است'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    if (isEdit) {
      updateRequest(Number(id), form)
    } else {
      addRequest({
        ...form,
        attachments: [
          files.image?.name,
          files.pdf?.name,
        ].filter(Boolean),
      })
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(() => navigate('/factory/requests'), 1500)
  }

  if (success) {
    return (
      <div className="dash-page">
        <div className="dash-success-state">
          <div className="dash-success-icon">✓</div>
          <h2>{isEdit ? 'درخواست با موفقیت ویرایش شد' : 'درخواست با موفقیت ثبت شد'}</h2>
          <p>در حال انتقال به لیست درخواست‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div className="dash-form-card">
        <h2 className="dash-form-title">{isEdit ? 'ویرایش نیاز فنی' : 'ثبت نیاز فنی جدید'}</h2>
        <p className="dash-form-subtitle">
          {isEdit
            ? 'اطلاعات نیاز فنی را ویرایش کنید.'
            : 'اطلاعات نیاز فنی کارخانه را وارد کنید تا متخصص مناسب پیدا شود.'}
        </p>

        <form onSubmit={handleSubmit} className="dash-form">
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
            <label className="auth-field-label">توضیحات مشکل <span className="rg-required">*</span></label>
            <textarea
              className={`dash-textarea${errors.description ? ' has-error' : ''}`}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="شرح کامل مشکل و شرایط کار..."
              rows={4}
            />
            {errors.description && <p className="auth-error-text">{errors.description}</p>}
          </div>

          <div className="dash-form-grid">
            <div className="auth-field">
              <label className="auth-field-label">تخصص مورد نیاز <span className="rg-required">*</span></label>
              <select
                className={`dash-select${errors.specialty ? ' has-error' : ''}`}
                value={form.specialty}
                onChange={(e) => update('specialty', e.target.value)}
              >
                <option value="">انتخاب کنید</option>
                {specialtySelectOptions.slice(1).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <p className="dash-field-hint">
                {form.specialty
                  ? `نمونه مهارت: ${getSpecialtyExample(form.specialty)}`
                  : getSpecialtyPlaceholder()}
              </p>
              {errors.specialty && <p className="auth-error-text">{errors.specialty}</p>}
            </div>

            <Input
              label="دستگاه"
              required
              value={form.equipment}
              error={errors.equipment}
              onChange={(e) => update('equipment', e.target.value)}
              placeholder="نام دستگاه"
            />

            <Input
              label="برند دستگاه"
              required
              value={form.brand}
              error={errors.brand}
              onChange={(e) => update('brand', e.target.value)}
              placeholder="مثال: Siemens"
            />

            <div className="auth-field">
              <label className="auth-field-label">نوع همکاری</label>
              <select
                className="dash-select"
                value={form.collaborationType}
                onChange={(e) => update('collaborationType', e.target.value)}
              >
                {COLLABORATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <Input
              label="شهر"
              required
              value={form.city}
              error={errors.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="شهر محل کار"
            />

            <Input
              label="سابقه مورد نیاز"
              value={form.experienceRequired}
              onChange={(e) => update('experienceRequired', e.target.value)}
              placeholder="مثال: ۵ سال"
            />

            <div className="auth-field">
              <label className="auth-field-label">فوریت</label>
              <select
                className="dash-select"
                value={form.urgency}
                onChange={(e) => update('urgency', e.target.value)}
              >
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {!isEdit && (
            <div className="dash-upload-section">
              <label className="auth-field-label">پیوست‌ها</label>
              <div className="dash-upload-grid">
                <label className="dash-upload-box">
                  <Upload size={20} />
                  <span>{files.image ? files.image.name : 'آپلود تصویر'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setFiles((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                  />
                </label>
                <label className="dash-upload-box">
                  <Upload size={20} />
                  <span>{files.pdf ? files.pdf.name : 'آپلود PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) => setFiles((f) => ({ ...f, pdf: e.target.files?.[0] || null }))}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="dash-form-actions">
            <Button type="button" variant="outline" onClick={() => navigate('/factory/requests')}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" loading={loading} loadingText={isEdit ? 'در حال ذخیره...' : 'در حال ثبت...'}>
              {isEdit ? 'ذخیره تغییرات' : 'ثبت درخواست'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
