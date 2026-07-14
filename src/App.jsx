import { AuthProvider } from './hooks/useAuth'
import ScrollToTop from './components/shared/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AppRoutes />
    </AuthProvider>
  )
}
