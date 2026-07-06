import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Logo from '../components/common/Logo'
import RegisterForm from '../components/auth/RegisterForm'
import RoleSelector from '../components/auth/RoleSelector'
import AuthLayout from '../layouts/AuthLayout'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  const initialRole = roleParam === 'factory' || roleParam === 'specialist' ? roleParam : null

  const [step, setStep] = useState(initialRole ? 'form' : 'role')
  const [role, setRole] = useState(initialRole)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole)
      setStep('form')
    }
  }, [initialRole])

  const handleSelectRole = useCallback((selected) => {
    if (isTransitioning) return

    setRole(selected)
    setIsTransitioning(true)

    window.setTimeout(() => {
      setStep('form')
      setIsTransitioning(false)
    }, 420)
  }, [isTransitioning])

  const handleBack = useCallback(() => {
    setStep('role')
    window.setTimeout(() => setRole(null), 320)
  }, [])

  const handleSuccess = useCallback(() => {
    setStep('success')
  }, [])

  const showRoleStep = step === 'role'
  const showFormStep = step === 'form' || step === 'success'

  return (
    <AuthLayout variant="register">
      <div className={`auth-register-content${showFormStep ? ' auth-register-content--form' : ''}`}>
        <div className="auth-register-top">
          <Logo variant="register" to="/" />
          <Link to="/login" className="auth-back-link">
            <ArrowRight size={15} aria-hidden="true" />
            بازگشت به ورود
          </Link>
        </div>

        {showRoleStep && (
          <div className={`rg-intro${isTransitioning ? ' rg-intro--exit' : ''}`}>
            <span className="rg-step-badge">مرحله ۱ از ۲</span>
            <h1 className="rg-title">حساب کاربری خود را ایجاد کنید</h1>
            <p className="rg-subtitle">برای شروع، نوع حساب خود را انتخاب کنید</p>
          </div>
        )}

        {showRoleStep && (
          <div className={`rg-role-stage${isTransitioning ? ' rg-role-stage--exit' : ''}`}>
            <RoleSelector
              selectedRole={role}
              onSelect={handleSelectRole}
              disabled={isTransitioning}
            />
          </div>
        )}

        {showFormStep && (
          <div className="auth-card auth-card--wide rg-form-panel">
            <RegisterForm
              step={step}
              role={role}
              onBack={handleBack}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
