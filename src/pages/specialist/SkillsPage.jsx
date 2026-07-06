import { Plus, Wrench } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import SkillTag from '../../components/dashboard/SkillTag'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function SkillsPage() {
  const { skills, addSkill, updateSkill, removeSkill } = useSpecialist()
  const [newSkill, setNewSkill] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editIndex, setEditIndex] = useState(null)
  const [editValue, setEditValue] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = newSkill.trim()
    if (!trimmed) {
      setError('نام مهارت را وارد کنید')
      return
    }
    if (skills.includes(trimmed)) {
      setError('این مهارت قبلاً اضافه شده')
      return
    }
    addSkill(trimmed)
    setNewSkill('')
    setError('')
    showSuccess('مهارت با موفقیت اضافه شد')
  }

  const handleEditSave = () => {
    if (editIndex === null) return
    const trimmed = editValue.trim()
    if (!trimmed) return
    updateSkill(editIndex, trimmed)
    setEditIndex(null)
    setEditValue('')
    showSuccess('مهارت ویرایش شد')
  }

  const handleRemove = (index) => {
    removeSkill(index)
    showSuccess('مهارت حذف شد')
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <p className="dash-page-desc">مهارت‌های فنی خود را مدیریت کنید. کارخانه‌ها بر اساس مهارت‌ها شما را پیدا می‌کنند.</p>

      <form className="dash-add-form" onSubmit={handleAdd}>
        <Input
          icon={Wrench}
          placeholder="مثال: PLC، برق صنعتی، اتوماسیون..."
          value={newSkill}
          onChange={(e) => { setNewSkill(e.target.value); setError('') }}
          fullWidth
        />
        <Button type="submit" variant="primary">
          <Plus size={16} />
          افزودن مهارت
        </Button>
      </form>
      {error && <p className="auth-error-text">{error}</p>}

      {skills.length === 0 ? (
        <EmptyState title="مهارتی ثبت نشده" description="مهارت‌های فنی خود را اضافه کنید." />
      ) : (
        <div className="dash-tags-grid">
          {skills.map((skill, index) => (
            <SkillTag
              key={`${skill}-${index}`}
              label={skill}
              onClick={() => { setEditIndex(index); setEditValue(skill) }}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}

      <Modal open={editIndex !== null} onClose={() => setEditIndex(null)} title="ویرایش مهارت">
        <Input
          icon={Wrench}
          label="نام مهارت"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          fullWidth
        />
        <div className="dash-modal-actions">
          <Button variant="outline" onClick={() => setEditIndex(null)}>انصراف</Button>
          <Button variant="primary" onClick={handleEditSave}>ذخیره</Button>
        </div>
      </Modal>
    </div>
  )
}
