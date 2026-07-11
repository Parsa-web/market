import { Navigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import AuthLayout from '../layouts/AuthLayout'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../utils/dashboardUtils'

export default function LoginPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="dash-loading-screen">
        <div className="dash-spinner" />
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
