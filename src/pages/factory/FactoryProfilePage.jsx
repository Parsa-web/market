import { Building2, MapPin, Phone, User } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Avatar from '../../components/dashboard/Avatar'
import { useAuth } from '../../hooks/useAuth'

export default function FactoryProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    company: user?.company || '',
    manager: user?.manager || '',
    industry: user?.industry || '',
    city: user?.city || '',
    lines: user?.lines || '',
    equipment: user?.equipment || '',
    phone: user?.phone || '',
  })
  const [saved, setSaved] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateUser(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="dash-page">
      {saved && <div className="dash-toast dash-toast--success">پروفایل با موفقیت ذخیره شد</div>}

      <div className="dash-profile-card">
        <div className="dash-profile-header">
          <Avatar name={user?.company} initials={user?.company?.slice(0, 2)} size="xl" />
          <div className="dash-profile-header-info">
            <h2>{user?.company}</h2>
            <p>{user?.industry}</p>
            <div className="dash-profile-meta">
              <MapPin size={14} />
              <span>{user?.city}</span>
            </div>
          </div>
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>ویرایش</Button>
          )}
        </div>

        {editing ? (
          <form className="dash-form" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
            <div className="dash-form-grid">
              <Input label="نام شرکت" value={form.company} onChange={(e) => update('company', e.target.value)} icon={Building2} />
              <Input label="مسئول فنی" value={form.manager} onChange={(e) => update('manager', e.target.value)} icon={User} />
              <Input label="صنعت" value={form.industry} onChange={(e) => update('industry', e.target.value)} />
              <Input label="شهر" value={form.city} onChange={(e) => update('city', e.target.value)} icon={MapPin} />
              <Input label="خطوط تولید" value={form.lines} onChange={(e) => update('lines', e.target.value)} fullWidth />
              <Input label="تجهیزات اصلی" value={form.equipment} onChange={(e) => update('equipment', e.target.value)} fullWidth />
              <Input label="شماره تماس" value={form.phone} onChange={(e) => update('phone', e.target.value)} icon={Phone} />
            </div>
            <div className="dash-form-actions">
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>انصراف</Button>
              <Button type="submit" variant="primary">ذخیره تغییرات</Button>
            </div>
          </form>
        ) : (
          <div className="dash-profile-details">
            <div className="dash-profile-section">
              <h3>درباره کارخانه</h3>
              <p>
                {user?.company} در حوزه {user?.industry} فعالیت می‌کند.
                خطوط تولید: {user?.lines || '—'}
              </p>
            </div>
            <div className="dash-profile-section">
              <h3>تجهیزات اصلی</h3>
              <p>{user?.equipment || '—'}</p>
            </div>
            <div className="dash-profile-section">
              <h3>اطلاعات تماس</h3>
              <div className="dash-profile-contact">
                <p><User size={16} /> {user?.manager}</p>
                <p><Phone size={16} /> {user?.phone}</p>
                <p><MapPin size={16} /> {user?.city}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
