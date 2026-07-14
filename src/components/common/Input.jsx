import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Input({
  label,
  icon: Icon,
  iconSize = 18,
  error,
  required = false,
  fullWidth = false,
  type = 'text',
  className = '',
  value,
  onChange,
  onClearError,
  suffix,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const handleChange = (event) => {
    onChange?.(event)
    onClearError?.()
  }

  const inputEl = (
    <input
      type={inputType}
      className={`auth-input${suffix ? ' auth-input--has-suffix' : ''}${error ? ' has-error' : ''}`}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )

  return (
    <div className={`auth-field${fullWidth ? ' rg-full' : ''}${className ? ` ${className}` : ''}`}>
      {label && (
        <label className="auth-field-label">
          {label}
          {required && <span className="rg-required">*</span>}
        </label>
      )}
      <div className="auth-input-wrapper">
        {Icon && <Icon className="auth-input-icon" size={iconSize} />}
        {suffix ? (
          <div className="auth-input-suffix-wrap">
            {inputEl}
            <span className="auth-input-suffix">{suffix}</span>
          </div>
        ) : inputEl}
        {isPassword && (
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="auth-error-text">{error}</p>}
    </div>
  )
}
