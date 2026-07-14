import { CalendarDays, Factory, FolderOpen, Image, Plus, Tags, Trash2, Upload, Wrench, X } from 'lucide-react'
import { useState, useRef } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/dashboard/Badge'
import BrandTag from '../../components/dashboard/BrandTag'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import SkillTag from '../../components/dashboard/SkillTag'
import { compressImage, fileToBase64, formatPersianDate } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'

const emptyProject = {
  title: '',
  description: '',
  industry: '',
  machines: [],
  brands: [],
  completionDate: '',
}

export default function PortfolioPage() {
  const { portfolio, addPortfolioItem, removePortfolioItem } = useSpecialist()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyProject)
  const [images, setImages] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [newMachine, setNewMachine] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const fileInputRef = useRef(null)

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addMachine = () => {
    const trimmed = newMachine.trim()
    if (!trimmed) return
    if (form.machines.includes(trimmed)) return
    setForm((prev) => ({ ...prev, machines: [...prev.machines, trimmed] }))
    setNewMachine('')
  }

  const removeMachine = (index) => {
    setForm((prev) => ({ ...prev, machines: prev.machines.filter((_, i) => i !== index) }))
  }

  const addBrand = () => {
    const trimmed = newBrand.trim()
    if (!trimmed) return
    if (form.brands.includes(trimmed)) return
    setForm((prev) => ({ ...prev, brands: [...prev.brands, trimmed] }))
    setNewBrand('')
  }

  const removeBrand = (index) => {
    setForm((prev) => ({ ...prev, brands: prev.brands.filter((_, i) => i !== index) }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    const newImages = await Promise.all(
      files.map(async (file) => {
        const compressed = file.type.startsWith('image/') ? await compressImage(file) : file
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          url: await fileToBase64(compressed),
          file: compressed,
        }
      })
    )
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setForm(emptyProject)
    setImages([])
    setErrorMsg('')
    setNewMachine('')
    setNewBrand('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setErrorMsg('')
    setSaving(true)

    try {
      await addPortfolioItem({
        title: form.title,
        description: form.description,
        industry: form.industry,
        machines: form.machines,
        brands: form.brands,
        images: images.map((img) => ({ name: img.name, url: img.url })),
        completionDate: form.completionDate ? new Date(form.completionDate).getTime() : Date.now(),
      })
      setModalOpen(false)
      setForm(emptyProject)
      setImages([])
      showSuccess('پروژه با موفقیت اضافه شد')
    } catch {
      setErrorMsg('خطا در ذخیره پروژه. لطفاً دوباره تلاش کنید.')
    }
    setSaving(false)
  }

  const openModal = () => {
    setForm(emptyProject)
    setImages([])
    setModalOpen(true)
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <div className="dash-page-toolbar">
        <p className="dash-page-desc">پروژه‌ها و مستندات صنعتی انجام‌شده را با شواهد تصویری و جزئیات فنی نمایش دهید.</p>
        <Button variant="primary" onClick={openModal}>
          <Plus size={16} />
          افزودن پروژه
        </Button>
      </div>

      {portfolio.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="نمونه‌کاری ثبت نشده"
          description="پروژه‌های صنعتی انجام‌شده را با جزئیات دستگاه، برند و تصویر اضافه کنید."
        />
      ) : (
        <div className="dash-portfolio-grid">
          {portfolio.map((project) => {
            const completionDate = project.completionDate || project.date
            const hasImages = project.images?.length > 0

            return (
              <article key={project.id} className="dash-portfolio-card">
                {hasImages ? (
                  <div className="dash-portfolio-gallery" aria-label="گالری مستندات پروژه">
                    {project.images.slice(0, 3).map((img, index) => (
                      <div key={`${project.id}-${index}`} className="dash-portfolio-proof">
                        {img.url ? (
                          <img src={img.url} alt={img.name || `تصویر ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <>
                            <Image size={18} />
                            <span>{img.name || `تصویر ${index + 1}`}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dash-portfolio-gallery dash-portfolio-gallery--empty">
                    <Image size={24} />
                    <span>بدون تصویر</span>
                  </div>
                )}

                <div className="dash-portfolio-content">
                  <div className="dash-portfolio-header">
                    <div>
                      <h3>{project.title}</h3>
                    </div>
                    <button
                      type="button"
                      className="dash-icon-btn dash-icon-btn--danger"
                      onClick={async () => { try { await removePortfolioItem(project.id); showSuccess('پروژه حذف شد') } catch { showSuccess('خطا در حذف پروژه') } }}
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="dash-portfolio-desc">{project.description}</p>

                  <div className="dash-portfolio-specs">
                    <div className="dash-portfolio-spec">
                      <Factory size={15} />
                      <span>دسته صنعتی</span>
                      <strong>{project.industry || 'ثبت نشده'}</strong>
                    </div>
                    <div className="dash-portfolio-spec">
                      <Wrench size={15} />
                      <span>دستگاه‌ها</span>
                      <strong>{project.machines?.join('، ') || 'ثبت نشده'}</strong>
                    </div>
                    <div className="dash-portfolio-spec">
                      <Tags size={15} />
                      <span>برندها</span>
                      <strong>{project.brands?.join('، ') || 'ثبت نشده'}</strong>
                    </div>
                    <div className="dash-portfolio-spec">
                      <CalendarDays size={15} />
                      <span>تاریخ تکمیل</span>
                      <strong>{formatPersianDate(completionDate)}</strong>
                    </div>
                  </div>

                  <div className="dash-portfolio-tags">
                    {project.industry && <Badge variant="machine">{project.industry}</Badge>}
                    {project.machines?.map((m) => <Badge key={m} variant="skill">{m}</Badge>)}
                    {project.brands?.map((b) => <Badge key={b} variant="brand">{b}</Badge>)}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={handleModalClose} title="افزودن پروژه">
        <form className="dash-form" onSubmit={handleSave}>
          <Input label="عنوان پروژه" icon={FolderOpen} value={form.title} onChange={(e) => update('title', e.target.value)} fullWidth required />
          <div className="auth-field rg-full">
            <label className="auth-field-label">توضیحات</label>
            <textarea
              className="dash-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
          <Input label="دسته صنعتی" icon={Factory} value={form.industry} onChange={(e) => update('industry', e.target.value)} fullWidth />

          <div className="dash-form-field">
            <label className="auth-field-label">دستگاه‌ها</label>
            <div className="dash-add-form">
              <Input
                icon={Wrench}
                placeholder="نام دستگاه را وارد کنید"
                value={newMachine}
                onChange={(e) => setNewMachine(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMachine() } }}
                fullWidth
              />
              <Button type="button" variant="primary" onClick={addMachine}>
                <Plus size={16} />
                افزودن
              </Button>
            </div>
            {form.machines.length > 0 && (
              <div className="dash-tags-grid" style={{ marginTop: 8 }}>
                {form.machines.map((m, i) => (
                  <SkillTag key={m} label={m} onRemove={() => removeMachine(i)} />
                ))}
              </div>
            )}
          </div>

          <div className="dash-form-field">
            <label className="auth-field-label">برندها</label>
            <div className="dash-add-form">
              <Input
                icon={Tags}
                placeholder="نام برند را وارد کنید"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBrand() } }}
                fullWidth
              />
              <Button type="button" variant="primary" onClick={addBrand}>
                <Plus size={16} />
                افزودن
              </Button>
            </div>
            {form.brands.length > 0 && (
              <div className="dash-tags-grid" style={{ marginTop: 8 }}>
                {form.brands.map((b, i) => (
                  <BrandTag key={b} label={b} onRemove={() => removeBrand(i)} />
                ))}
              </div>
            )}
          </div>

          <Input label="تاریخ تکمیل" icon={CalendarDays} type="date" value={form.completionDate} onChange={(e) => update('completionDate', e.target.value)} fullWidth />

          <div className="dash-form-field">
            <label className="auth-field-label">تصاویر پروژه</label>
            <div className="dash-upload-grid">
              {images.map((img) => (
                <div key={img.id} className="dash-portfolio-proof dash-portfolio-proof--uploaded">
                  <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" className="dash-portfolio-proof-remove" onClick={() => removeImage(img.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="dash-upload-box dash-upload-box--sm">
                <Upload size={18} />
                <span>افزودن تصویر</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {errorMsg && <div className="dash-toast dash-toast--error">{errorMsg}</div>}

          <div className="dash-modal-actions">
            <Button type="button" variant="outline" onClick={handleModalClose}>انصراف</Button>
            <Button type="submit" variant="primary" loading={saving} loadingText="در حال ذخیره...">ذخیره</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
