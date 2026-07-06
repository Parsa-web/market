import { Link } from 'react-router-dom'

export default function Logo({ variant = 'header', to = '/', onClick, light = false }) {
  const markClass = light ? 'logo-mark logo-mark-light' : 'logo-mark'
  const content = (
    <>
      <div className={variant === 'auth' ? 'auth-brand-mark' : variant === 'register' ? 'rg-brand-mark' : markClass}>
        ص
      </div>
      <span
        className={
          variant === 'auth'
            ? 'auth-brand-name'
            : variant === 'register'
              ? 'rg-brand-name'
              : variant === 'footer'
                ? undefined
                : 'logo-text'
        }
      >
        صنعت‌نت
      </span>
    </>
  )

  if (variant === 'auth') {
    return <div className="auth-brand">{content}</div>
  }

  if (variant === 'register') {
    if (to) {
      return (
        <Link to={to} className="rg-brand" onClick={onClick}>
          {content}
        </Link>
      )
    }

    return (
      <div className="rg-brand" onClick={onClick}>
        {content}
      </div>
    )
  }

  if (variant === 'footer') {
    return <div className="footer-logo">{content}</div>
  }

  return (
    <Link to={to} className="header-logo" onClick={onClick}>
      {content}
    </Link>
  )
}
