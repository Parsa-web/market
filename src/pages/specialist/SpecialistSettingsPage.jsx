import { useState } from 'react'
import { AlertTriangle, Trash2, KeyRound, Save } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/dashboard/Modal'
import { useAuth } from '../../hooks/useAuth'

export default function SpecialistSettingsPage() {
  const { deleteAccount, logout } = useAuth()
  const [passwordForm, setPasswordForm] = useState({ newPass: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwordForm.newPass.length < 6) {
      setPasswordError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد')
      return
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError('رمز عبور و تکرار آن یکسان نیست')
      return
    }
    setPasswordError('')
    setPasswordSuccess(true)
    setPasswordForm({ newPass: '', confirm: '' })
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      logout()
    } catch {
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  return (
    <div className="dash-page">
      {passwordSuccess && <div className="dash-toast dash-toast--success">رمز عبور با موفقیت تغییر کرد</div>}

      <div className="dash-settings-grid">
        <section className="dash-settings-card">
          <h2 className="dash-settings-title">تغییر رمز عبور</h2>
          <p className="dash-settings-desc">رمز عبور جدید خود را وارد کنید. حداقل ۶ کاراکتر.</p>
          <form onSubmit={handlePasswordChange} className="dash-form">
            <Input label="رمز عبور جدید" type="password" icon={KeyRound} value={passwordForm.newPass} onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))} fullWidth placeholder="حداقل ۶ کاراکتر" />
            <Input label="تکرار رمز عبور" type="password" icon={KeyRound} value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} fullWidth placeholder="تکرار رمز عبور جدید" />
            {passwordError && <p className="auth-error-text">{passwordError}</p>}
            <Button type="submit" variant="primary"><Save size={15} /> ذخیره رمز عبور</Button>
          </form>
        </section>

        <section className="dash-settings-card dash-settings-card--danger">
          <div className="dash-settings-danger-inner">
            <div className="dash-settings-danger-icon">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="dash-settings-title">حذف حساب کاربری</h2>
              <p className="dash-settings-desc">
                با حذف حساب، تمام اطلاعات شما شامل درخواست‌ها، پیام‌ها و اطلاعات پروفایل به‌طور دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.
              </p>
              <button type="button" className="dash-btn-danger-full" onClick={() => setDeleteConfirm(true)}>
                <Trash2 size={15} />
                حذف حساب کاربری
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal open={deleteConfirm} onClose={() => !deleting && setDeleteConfirm(false)} title="حذف حساب کاربری">
        <div className="dash-delete-account">
          <div className="dash-delete-account-icon">
            <AlertTriangle size={28} />
          </div>
          <h3>آیا از حذف حساب خود اطمینان دارید؟</h3>
          <p>تمام اطلاعات شما شامل درخواست‌ها، پیام‌ها و اطلاعات پروفایل برای همیشه حذف خواهند شد.</p>
          <div className="dash-modal-actions">
            <Button variant="primary" className="dash-btn-danger" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'در حال حذف...' : 'بله، حذف کن'}
            </Button>
            <Button variant="outline" onClick={() => setDeleteConfirm(false)} disabled={deleting}>انصراف</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}