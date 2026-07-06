import { Lock, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'
import Logo from '../common/Logo'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const validate = () => {
    const newErrors = {}

    const val = identifier.trim()

    if (!val) {
      newErrors.identifier = 'لطفاً شماره موبایل یا ایمیل را وارد کنید'
    }

    if (!password) {
      newErrors.password = 'لطفاً رمز عبور را وارد کنید'
    } else if (password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const result = await login({ identifier, password })
      const from = location.state?.from
      if (from) {
        navigate(from)
      } else {
        navigate(result.role === 'factory' ? '/factory' : '/specialist')
      }
    } catch (err) {
      setErrors({ password: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleForgotPassword = () => {
    setNotice('برای بازیابی رمز عبور با پشتیبانی صنعت‌نت تماس بگیرید یا یک حساب جدید بسازید.')
  }

  return (
    <Card variant="auth">
      <Logo variant="auth" />

      <h1 className="auth-title">خوش آمدید</h1>
      <p className="auth-subtitle">وارد حساب کاربری خود شوید</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="شماره موبایل یا ایمیل"
          icon={Phone}
          placeholder="۰۹۱۲xxxxxxx یا example@email.com"
          value={identifier}
          error={errors.identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          onClearError={() => clearError('identifier')}
        />

        <Input
          label="رمز عبور"
          icon={Lock}
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
          onClearError={() => clearError('password')}
        />

        <div className="auth-submit">
          <Button type="submit" auth loading={isLoading} loadingText="در حال ورود...">
            ورود به حساب
          </Button>
        </div>
      </form>

      <button type="button" className="auth-forgot" onClick={handleForgotPassword}>
        رمز عبور را فراموش کرده‌اید؟
      </button>

      {notice && <p className="auth-notice">{notice}</p>}

      <div className="auth-divider" />

      <div className="auth-links">
        <p className="auth-link-text">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="auth-link">
            ثبت نام کنید
          </Link>
        </p>
      </div>
    </Card>
  )
}
