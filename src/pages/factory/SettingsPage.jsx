import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useFactory } from '../../hooks/useFactory'

export default function SettingsPage() {
  const { settings, updateSettings } = useFactory()
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [notifSettings, setNotifSettings] = useState(settings)

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
    setPasswordForm({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const handleNotifChange = (key) => {
    const updated = { ...notifSettings, [key]: !notifSettings[key] }
    setNotifSettings(updated)
    updateSettings(updated)
  }

  const toggles = [
    { key: 'emailNotifications', label: 'اعلان ایمیل', desc: 'دریافت اعلان‌ها از طریق ایمیل' },
    { key: 'smsNotifications', label: 'اعلان پیامک', desc: 'دریافت اعلان‌ها از طریق پیامک' },
    { key: 'newMessageAlert', label: 'پیام جدید', desc: 'اطلاع‌رسانی هنگام دریافت پیام جدید' },
    { key: 'requestUpdateAlert', label: 'به‌روزرسانی درخواست', desc: 'اطلاع‌رسانی تغییرات درخواست‌ها' },
  ]

  return (
    <div className="dash-page">
      {passwordSuccess && <div className="dash-toast dash-toast--success">رمز عبور با موفقیت تغییر کرد</div>}

      <div className="dash-settings-grid">
        <section className="dash-settings-card">
          <h2 className="dash-settings-title">تغییر رمز عبور</h2>
          <form onSubmit={handlePasswordChange} className="dash-form">
            <Input
              label="رمز عبور فعلی"
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
              fullWidth
            />
            <Input
              label="رمز عبور جدید"
              type="password"
              value={passwordForm.newPass}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
              fullWidth
            />
            <Input
              label="تکرار رمز عبور"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              fullWidth
            />
            {passwordError && <p className="auth-error-text">{passwordError}</p>}
            <Button type="submit" variant="primary">ذخیره رمز عبور</Button>
          </form>
        </section>

        <section className="dash-settings-card">
          <h2 className="dash-settings-title">تنظیمات اعلان</h2>
          <div className="dash-toggle-list">
            {toggles.map((item) => (
              <label key={item.key} className="dash-toggle-item">
                <div>
                  <span className="dash-toggle-label">{item.label}</span>
                  <span className="dash-toggle-desc">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings[item.key]}
                  onChange={() => handleNotifChange(item.key)}
                  className="dash-toggle-input"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="dash-settings-card">
          <h2 className="dash-settings-title">امنیت</h2>
          <div className="dash-security-info">
            <p>آخرین ورود: امروز</p>
            <p>دستگاه فعال: مرورگر وب</p>
            <p>احراز هویت دو مرحله‌ای: غیرفعال</p>
          </div>
          <Button variant="outline">فعال‌سازی احراز هویت دو مرحله‌ای</Button>
        </section>

        <section className="dash-settings-card dash-settings-card--danger">
          <h2 className="dash-settings-title">مدیریت حساب</h2>
          <p className="dash-settings-desc">با حذف حساب، تمام اطلاعات شما به‌طور دائمی حذف خواهد شد.</p>
          <Button variant="ghost" className="dash-btn-danger">حذف حساب کاربری</Button>
        </section>
      </div>
    </div>
  )
}
