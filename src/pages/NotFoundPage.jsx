import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h1 className="auth-title">۴۰۴</h1>
          <p className="auth-subtitle">صفحه مورد نظر یافت نشد</p>
          <div className="auth-submit">
            <Link to="/" className="auth-btn auth-btn-primary">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
