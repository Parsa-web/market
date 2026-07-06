import { Factory, Plus } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import EmptyState from '../../components/dashboard/EmptyState'
import BrandTag from '../../components/dashboard/BrandTag'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function BrandsPage() {
  const { brands, addBrand, removeBrand } = useSpecialist()
  const [newBrand, setNewBrand] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = newBrand.trim()
    if (!trimmed) {
      setError('نام برند را وارد کنید')
      return
    }
    if (brands.includes(trimmed)) {
      setError('این برند قبلاً اضافه شده')
      return
    }
    addBrand(trimmed)
    setNewBrand('')
    setError('')
    showSuccess('برند با موفقیت اضافه شد')
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <p className="dash-page-desc">برندهای تجهیزات صنعتی که با آن‌ها آشنایی دارید.</p>

      <form className="dash-add-form" onSubmit={handleAdd}>
        <Input
          icon={Factory}
          placeholder="مثال: Siemens، ABB، Omron..."
          value={newBrand}
          onChange={(e) => { setNewBrand(e.target.value); setError('') }}
          fullWidth
        />
        <Button type="submit" variant="primary">
          <Plus size={16} />
          افزودن برند
        </Button>
      </form>
      {error && <p className="auth-error-text">{error}</p>}

      {brands.length === 0 ? (
        <EmptyState title="برندی ثبت نشده" description="برندهای مسلط خود را اضافه کنید." />
      ) : (
        <div className="dash-brands-grid">
          {brands.map((brand, index) => (
            <BrandTag
              key={`${brand}-${index}`}
              label={brand}
              onRemove={() => { removeBrand(index); showSuccess('برند حذف شد') }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
