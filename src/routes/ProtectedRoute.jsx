import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ role }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="dash-loading-screen">
        <div className="dash-spinner" />
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    const redirect = user.role === 'factory' ? '/factory' : '/specialist'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
