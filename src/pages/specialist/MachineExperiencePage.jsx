import { Briefcase, Cpu, Factory, Plus, Tags } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import EmptyState from '../../components/dashboard/EmptyState'
import MachineCard from '../../components/dashboard/MachineCard'
import Modal from '../../components/dashboard/Modal'
import { useSpecialist } from '../../hooks/useSpecialist'

const emptyMachine = {
  name: '',
  brand: '',
  industry: '',
  years: '',
  description: '',
}

export default function MachineExperiencePage() {
  const { machines, addMachine, updateMachine, removeMachine } = useSpecialist()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMachine)
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyMachine)
    setModalOpen(true)
  }

  const openEdit = (machine) => {
    setEditing(machine)
    setForm({ ...machine })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.brand.trim()) return

    if (editing) {
      updateMachine(editing.id, form)
      showSuccess('تجربه دستگاه ویرایش شد')
    } else {
      addMachine(form)
      showSuccess('تجربه دستگاه اضافه شد')
    }
    setModalOpen(false)
  }

  const handleRemove = (machine) => {
    removeMachine(machine.id)
    showSuccess('تجربه دستگاه حذف شد')
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <div className="dash-page-toolbar">
        <p className="dash-page-desc">تجربه کار با دستگاه‌های صنعتی — مهم‌ترین بخش پروفایل تخصصی شما</p>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={16} />
          افزودن تجربه
        </Button>
      </div>

      {machines.length === 0 ? (
        <EmptyState title="تجربه دستگاهی ثبت نشده" description="دستگاه‌هایی که با آن‌ها کار کرده‌اید را اضافه کنید." />
      ) : (
        <div className="dash-machines-grid">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onEdit={openEdit}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'ویرایش تجربه دستگاه' : 'افزودن تجربه دستگاه'}
      >
        <form className="dash-form" onSubmit={handleSave}>
          <Input label="نام دستگاه" icon={Cpu} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required fullWidth />
          <Input label="برند" icon={Tags} value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} required />
          <Input label="صنعت" icon={Factory} value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
          <Input label="سال تجربه" icon={Briefcase} value={form.years} onChange={(e) => setForm((p) => ({ ...p, years: e.target.value }))} />
          <div className="auth-field rg-full">
            <label className="auth-field-label">توضیحات</label>
            <textarea
              className="dash-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="dash-modal-actions">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="submit" variant="primary">ذخیره</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
