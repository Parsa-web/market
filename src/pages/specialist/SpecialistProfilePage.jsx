import { Briefcase, Factory, Handshake, MapPin, Plus, Tag, User, Wrench } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Avatar from '../../components/dashboard/Avatar'
import Badge from '../../components/dashboard/Badge'
import BrandTag from '../../components/dashboard/BrandTag'
import Modal from '../../components/dashboard/Modal'
import ProgressCard from '../../components/dashboard/ProgressCard'
import SkillTag from '../../components/dashboard/SkillTag'
import { useAuth } from '../../hooks/useAuth'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function SpecialistProfilePage() {
  const { user, updateUser } = useAuth()
  const {
    profileData,
    stats,
    updateProfileFields,
    skills,
    addSkill,
    updateSkill,
    removeSkill,
    brands,
    addBrand,
    removeBrand,
  } = useSpecialist()

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    specialty: user?.specialty || '',
    experience: user?.experience || '',
    city: user?.city || '',
    introduction: profileData.introduction || '',
    availability: profileData.availability || 'آماده همکاری',
  })

  const [newSkill, setNewSkill] = useState('')
  const [skillError, setSkillError] = useState('')
  const [editSkillIndex, setEditSkillIndex] = useState(null)
  const [editSkillValue, setEditSkillValue] = useState('')

  const [newBrand, setNewBrand] = useState('')
  const [brandError, setBrandError] = useState('')

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateUser({
      fullName: form.fullName,
      specialty: form.specialty,
      experience: form.experience,
      city: form.city,
    })
    updateProfileFields({
      introduction: form.introduction,
      availability: form.availability,
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    const trimmed = newSkill.trim()
    if (!trimmed) {
      setSkillError('نام مهارت را وارد کنید')
      return
    }
    if (skills.includes(trimmed)) {
      setSkillError('این مهارت قبلاً اضافه شده')
      return
    }
    addSkill(trimmed)
    setNewSkill('')
    setSkillError('')
  }

  const handleEditSkillSave = () => {
    if (editSkillIndex === null) return
    const trimmed = editSkillValue.trim()
    if (!trimmed) return
    updateSkill(editSkillIndex, trimmed)
    setEditSkillIndex(null)
    setEditSkillValue('')
  }

  const handleAddBrand = (e) => {
    e.preventDefault()
    const trimmed = newBrand.trim()
    if (!trimmed) {
      setBrandError('نام برند را وارد کنید')
      return
    }
    if (brands.includes(trimmed)) {
      setBrandError('این برند قبلاً اضافه شده')
      return
    }
    addBrand(trimmed)
    setNewBrand('')
    setBrandError('')
  }

  const initials = user?.fullName?.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <div className="dash-page">
      {saved && <div className="dash-toast dash-toast--success">پروفایل با موفقیت ذخیره شد</div>}

      <div className="dash-profile-completion-banner">
        <ProgressCard
          percentage={stats.profileCompletion}
          missingItems={profileData.missingItems}
        />
      </div>

      <div className="dash-profile-card">
        <div className="dash-profile-header">
          <Avatar name={user?.fullName} initials={initials} size="xl" />
          <div className="dash-profile-header-info">
            <h2>{user?.fullName}</h2>
            <p>{user?.specialty}</p>
            <div className="dash-profile-meta">
              <MapPin size={14} />
              <span>{user?.city}</span>
              <Badge variant="active">{profileData.availability}</Badge>
            </div>
          </div>
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>ویرایش</Button>
          )}
        </div>

        {editing ? (
          <form className="dash-form" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
            <div className="dash-form-grid">
              <Input label="نام و نام خانوادگی" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} icon={User} />
              <Input label="تخصص اصلی" value={form.specialty} onChange={(e) => update('specialty', e.target.value)} icon={Wrench} />
              <Input label="سال تجربه" value={form.experience} onChange={(e) => update('experience', e.target.value)} icon={Briefcase} />
              <Input label="شهر" value={form.city} onChange={(e) => update('city', e.target.value)} icon={MapPin} />
              <Input label="وضعیت همکاری" value={form.availability} onChange={(e) => update('availability', e.target.value)} icon={Handshake} fullWidth />
            </div>
            <div className="dash-form-field">
              <label className="auth-label">معرفی حرفه‌ای</label>
              <textarea
                className="dash-textarea"
                rows={4}
                value={form.introduction}
                onChange={(e) => update('introduction', e.target.value)}
                placeholder="درباره تجربه و تخصص خود بنویسید..."
              />
            </div>

            <div className="dash-profile-edit-divider" />

            <div className="dash-profile-edit-section">
              <div className="dash-profile-section-header">
                <Wrench size={18} className="dash-profile-section-icon dash-profile-section-icon--primary" />
                <h3>مهارت‌های فنی</h3>
              </div>
              <form className="dash-add-form" onSubmit={handleAddSkill}>
                <Input
                  icon={Wrench}
                  placeholder="مثال: PLC، برق صنعتی، اتوماسیون..."
                  value={newSkill}
                  onChange={(e) => { setNewSkill(e.target.value); setSkillError('') }}
                  fullWidth
                />
                <Button type="submit" variant="primary">
                  <Plus size={16} />
                  افزودن
                </Button>
              </form>
              {skillError && <p className="auth-error-text">{skillError}</p>}
              {skills.length > 0 && (
                <div className="dash-tags-grid">
                  {skills.map((skill, index) => (
                    <SkillTag
                      key={`${skill}-${index}`}
                      label={skill}
                      onClick={() => { setEditSkillIndex(index); setEditSkillValue(skill) }}
                      onRemove={() => removeSkill(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="dash-profile-edit-divider" />

            <div className="dash-profile-edit-section">
              <div className="dash-profile-section-header">
                <Tag size={18} className="dash-profile-section-icon dash-profile-section-icon--teal" />
                <h3>برندهای مسلط</h3>
              </div>
              <form className="dash-add-form" onSubmit={handleAddBrand}>
                <Input
                  icon={Factory}
                  placeholder="مثال: Siemens، ABB، Omron..."
                  value={newBrand}
                  onChange={(e) => { setNewBrand(e.target.value); setBrandError('') }}
                  fullWidth
                />
                <Button type="submit" variant="primary">
                  <Plus size={16} />
                  افزودن
                </Button>
              </form>
              {brandError && <p className="auth-error-text">{brandError}</p>}
              {brands.length > 0 && (
                <div className="dash-brands-grid">
                  {brands.map((brand, index) => (
                    <BrandTag
                      key={`${brand}-${index}`}
                      label={brand}
                      onRemove={() => removeBrand(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="dash-form-actions">
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>انصراف</Button>
              <Button type="submit" variant="primary">ذخیره تغییرات</Button>
            </div>
          </form>
        ) : (
          <div className="dash-profile-details">
            <div className="dash-profile-section">
              <h3>معرفی</h3>
              <p>{profileData.introduction || '—'}</p>
            </div>
            <div className="dash-profile-section">
              <h3>اطلاعات حرفه‌ای</h3>
              <div className="dash-profile-contact">
                <p><Briefcase size={16} /> {user?.experience} سال تجربه</p>
                <p><User size={16} /> {user?.specialty}</p>
                <p><MapPin size={16} /> {user?.city}</p>
              </div>
            </div>
            <div className="dash-profile-section">
              <h3>وضعیت همکاری</h3>
              <Badge variant="active">{profileData.availability}</Badge>
            </div>
            {skills.length > 0 && (
              <div className="dash-profile-section">
                <div className="dash-profile-section-header">
                  <Wrench size={16} className="dash-profile-section-icon dash-profile-section-icon--primary" />
                  <h3>مهارت‌های فنی</h3>
                </div>
                <div className="dash-tags-grid">
                  {skills.map((skill, index) => (
                    <SkillTag key={`${skill}-${index}`} label={skill} />
                  ))}
                </div>
              </div>
            )}
            {brands.length > 0 && (
              <div className="dash-profile-section">
                <div className="dash-profile-section-header">
                  <Tag size={16} className="dash-profile-section-icon dash-profile-section-icon--teal" />
                  <h3>برندهای مسلط</h3>
                </div>
                <div className="dash-brands-grid">
                  {brands.map((brand, index) => (
                    <BrandTag key={`${brand}-${index}`} label={brand} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal open={editSkillIndex !== null} onClose={() => setEditSkillIndex(null)} title="ویرایش مهارت">
        <Input
          icon={Wrench}
          label="نام مهارت"
          value={editSkillValue}
          onChange={(e) => setEditSkillValue(e.target.value)}
          fullWidth
        />
        <div className="dash-modal-actions">
          <Button variant="outline" onClick={() => setEditSkillIndex(null)}>انصراف</Button>
          <Button variant="primary" onClick={handleEditSkillSave}>ذخیره</Button>
        </div>
      </Modal>
    </div>
  )
}
