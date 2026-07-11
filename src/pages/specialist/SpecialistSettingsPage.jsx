import { Eye, KeyRound, MessageSquare, Send, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useSpecialist } from '../../hooks/useSpecialist'

const NOTIFICATION_DEFAULTS = {
  applicationAlert: true,
  newMessageAlert: true,
  profileViewAlert: true,
  requestUpdateAlert: true,
}

const NOTIFICATION_GROUPS = [
  { key: 'applicationAlert', icon: Send, label: 'وضعیت درخواست', desc: 'تغییر وضعیت درخواست‌های ارسال‌شده (پذیرفته/رد شده).' },
  { key: 'newMessageAlert', icon: MessageSquare, label: 'پیام جدید', desc: 'برای پیام‌های جدید کارخانه‌ها و مکالمات فعال.' },
  { key: 'profileViewAlert', icon: Eye, label: 'بازدید پروفایل', desc: 'وقتی پروفایل تخصصی شما توسط کارخانه‌ها دیده می‌شود.' },
  { key: 'requestUpdateAlert', icon: RefreshCw, label: 'به‌روزرسانی درخواست', desc: 'تغییر وضعیت فرصت‌ها و درخواست‌های صنعتی.' },
]

export default function SpecialistSettingsPage() {
  const { settings, updateSettings } = useSpecialist()
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [notifSettings, setNotifSettings] = useState(NOTIFICATION_DEFAULTS)

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setNotifSettings((prev) => ({ ...prev, ...settings }))
    }
  }, [settings])

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

  return (
    <div className="dash-page">
      {passwordSuccess && <div className="dash-toast dash-toast--success">رمز عبور با موفقیت تغییر کرد</div>}

      <div className="dash-settings-grid">
        <section className="dash-settings-card">
          <h2 className="dash-settings-title">تغییر رمز عبور</h2>
          <form onSubmit={handlePasswordChange} className="dash-form">
            <Input
              label="رمز عبور فعلی"
              icon={KeyRound}
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
              fullWidth
            />
            <Input
              label="رمز عبور جدید"
              icon={KeyRound}
              type="password"
              value={passwordForm.newPass}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
              fullWidth
            />
            <Input
              label="تکرار رمز عبور"
              icon={KeyRound}
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              fullWidth
            />
            {passwordError && <p className="auth-error-text">{passwordError}</p>}
            <Button type="submit" variant="primary">ذخیره رمز عبور</Button>
          </form>
        </section>

        <section className="dash-settings-card dash-settings-card--wide">
          <h2 className="dash-settings-title">اعلان‌های کاری</h2>
          <div className="dash-toggle-list">
            {NOTIFICATION_GROUPS.map((item) => {
              const Icon = item.icon

              return (
                <label key={item.key} className="dash-toggle-item">
                  <span className="dash-toggle-icon"><Icon size={18} /></span>
                  <span className="dash-toggle-copy">
                    <span className="dash-toggle-label">{item.label}</span>
                    <span className="dash-toggle-desc">{item.desc}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={!!notifSettings[item.key]}
                    onChange={() => handleNotifChange(item.key)}
                    className="dash-toggle-input"
                  />
                </label>
              )
            })}
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
      </div>
    </div>
  )
}
