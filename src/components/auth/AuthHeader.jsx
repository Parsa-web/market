import { Link } from 'react-router-dom'
import Logo from '../common/Logo'

export default function AuthHeader() {
  return (
    <header className="auth-header">
      <div className="container auth-header-inner">
        <Logo variant="register" to="/" />
        <Link to="/login" className="auth-header-link">
          ورود به حساب کاربری
        </Link>
      </div>
    </header>
  )
}